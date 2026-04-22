import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { appName } from "../constant.js";
import { prisma } from "../db/prisma.js";
import { sendEmail } from "../services/email.service.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { emailVerificationTemplate } from "../utils/emailTemplates.utils.js";
import { generateEmailVerificationToken } from "../utils/emailToken.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtTokens.utils.js";
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

  const user = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: expiry,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
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

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user, accessToken, refreshToken },
        "User registered successfully",
      ),
    );
});

const login = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged in successfully" });
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged out successfully" });
});

export { login, logout, register };
