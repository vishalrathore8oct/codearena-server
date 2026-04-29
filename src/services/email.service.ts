import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { appName } from "../constant.js";
import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/ApiError.utils.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: `${appName} Team`,
    link: `${env.APP_BASE_URL}`,
  },
});

export const sendEmail = async ({
  to,
  subject,
  mailgenContent,
}: {
  to: string;
  subject: string;
  mailgenContent: Mailgen.Content;
}) => {
  try {
    const html = mailGenerator.generate(mailgenContent);
    const text = mailGenerator.generatePlaintext(mailgenContent);

    await transporter.sendMail({
      from: env.SMTP_USERNAME,
      to,
      subject,
      text,
      html,
    });
    logger.info(`✅ Email sent to ${to} with subject "${subject}"`);
  } catch (error: unknown) {
    logger.error(
      `❌ Email failed to send to ${to} with subject "${subject}":`,
      error,
    );

    throw new ApiError(500, "Failed to send email");
  }
};
