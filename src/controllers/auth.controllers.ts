import bcrypt from "bcrypt";
import crypto from "crypto";
import type { CookieOptions, Request, Response } from "express";
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

  const { verificationToken, hashedToken, expiry } =
    generateEmailVerificationToken();
  const baseUrl =
    process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;

  const emailVerificationUrl = `${baseUrl}/api/v1/auth/verify-email/${verificationToken}`;

  const profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName,
  )}&background=random`;

  const user = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      image: profileImage,
      password: hashedPassword,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: expiry,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      image: true, // ✅ include this
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

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user },
        "Users registered successfully and verification email has been sent on your email. Please verify your email to activate your account.",
      ),
    );
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const verificationToken = req.params.verificationToken as string;

  if (!verificationToken) {
    throw new ApiError(400, "Verification token is missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

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
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(401, "Please verify your email before logging in");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });

  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            image: user.image,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged out successfully" });
});

export { login, logout, register, verifyEmail };
