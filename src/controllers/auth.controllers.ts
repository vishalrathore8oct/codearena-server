import bcrypt from "bcrypt";
import crypto from "crypto";
import type { Request, Response } from "express";
import { appName } from "../constant.js";
import { prisma } from "../db/prisma.js";
import { sendEmail } from "../services/email.service.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { emailVerificationTemplate } from "../utils/emailTemplates.utils.js";
import { generateEmailVerificationToken } from "../utils/emailToken.utils.js";
import { generateUniqueUsernameForDB } from "../utils/usernameGenerator.utils.js";

const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const username = await generateUniqueUsernameForDB(fullName);

  const hashedPassword = await bcrypt.hash(password, 10);

  const { token, hashedToken, expiry } = generateEmailVerificationToken();
  const baseUrl =
    process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;

  const emailVerificationUrl = `${baseUrl}/api/v1/auth/verify-email/${token}`;

  await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: expiry,
    },
  });

  await sendEmail({
    to: email,
    subject: `Verify Your ${appName} Account`,
    mailgenContent: emailVerificationTemplate(
      fullName,
      username,
      emailVerificationUrl,
    ),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        null,
        "Users registered successfully and verification email has been sent on your email. Please verify your email to activate your account.",
      ),
    );
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token) {
    throw new ApiError(400, "Verification token is missing");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Email verified successfully. You can now log in to your account.",
      ),
    );
});

const login = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged in successfully" });
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged out successfully" });
});

export { login, logout, register, verifyEmail };
