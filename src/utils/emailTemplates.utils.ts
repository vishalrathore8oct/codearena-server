import Mailgen from "mailgen";
import { appName } from "../constant.js";

const emailVerificationTemplate = (
  fullName: string,
  username: string,
  verificationUrl: string,
): Mailgen.Content => ({
  body: {
    name: `${fullName} (${username})`,
    intro: `Welcome to ${appName}! We're excited to have you 🎉`,
    action: {
      instructions: "Click the button below to verify your email:",
      button: {
        color: "#22BC66",
        text: "Verify Email",
        link: verificationUrl,
      },
    },
    outro: "If you didn’t create this account, ignore this email.",
  },
});

const forgotPasswordTemplate = (
  fullName: string,
  username: string,
  resetUrl: string,
): Mailgen.Content => ({
  body: {
    name: `${fullName} (${username})`,
    intro: `We received a request to reset your ${appName} password.`,
    action: {
      instructions: "Click below to reset your password:",
      button: {
        color: "#FF8C00",
        text: "Reset Password",
        link: resetUrl,
      },
    },
    outro: "If you didn’t request this, ignore it.",
  },
});

export { emailVerificationTemplate, forgotPasswordTemplate };
