import bcrypt from "bcrypt";
import crypto from "crypto";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Prisma } from "../../generated/prisma/client.js";
import { env } from "../config/env.js";
import { appName, cookieOptions } from "../constant.js";
import { prisma } from "../db/prisma.js";
import { sendEmail } from "../services/email.service.js";
import type { AuthUser } from "../types/auth.types.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.utils.js";
import {
  emailVerificationTemplate,
  forgotPasswordTemplate,
} from "../utils/emailTemplates.utils.js";
import {
  generateEmailVerificationToken,
  hashToken,
} from "../utils/emailToken.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtTokens.utils.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.utils.js";
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
    throw new ApiError(
      401,
      "Please verify your email to activate your account before logging in",
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
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

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  let incomingRefreshToken: string | undefined;

  if (req.cookies?.refreshToken) {
    incomingRefreshToken = req.cookies.refreshToken;
  } else if (req.body?.refreshToken) {
    incomingRefreshToken = req.body.refreshToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    incomingRefreshToken = req.headers.authorization.split(" ")[1];
  }

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decoded: AuthUser;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET,
    ) as AuthUser;
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || !user.refreshToken) {
    throw new ApiError(401, "User not found or no refresh token stored");
  }

  const isValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);

  if (!isValid) {
    throw new ApiError(401, "Refresh token mismatch or reused token detected");
  }

  const newAccessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id, user.role);

  const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed or rotated successfully",
      ),
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  let userId: string | undefined;

  if (req.user?.id) {
    userId = req.user.id;
  } else {
    const token =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (token) {
      try {
        const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as AuthUser;
        userId = decoded.id;
      } catch {
        // ignore invalid token → just clear cookies
      }
    }
  }

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      image: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "Current user profile fetched successfully",
    ),
  );
});

const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, "Email is already verified");
    }

    const { verificationToken, hashedToken, expiry } =
      generateEmailVerificationToken();
    const baseUrl =
      process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;

    const emailVerificationUrl = `${baseUrl}/api/v1/auth/verify-email/${verificationToken}`;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiresAt: expiry,
      },
    });

    await sendEmail({
      to: email,
      subject: `Verify Your ${appName} Account`,
      mailgenContent: emailVerificationTemplate(
        user.fullName,
        user.username,
        emailVerificationUrl,
      ),
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Verification email Resent on your email successfully. Please verify your email to activate your account.",
        ),
      );
  },
);

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If an account exists, a password reset link has been sent",
        ),
      );
  }

  const { verificationToken, hashedToken, expiry } =
    generateEmailVerificationToken();
  const baseUrl =
    process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;

  const emailVerificationUrl = `${baseUrl}/api/v1/auth/reset-password/${verificationToken}`;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: expiry,
    },
  });

  await sendEmail({
    to: email,
    subject: `Reset Your ${appName} Password`,
    mailgenContent: forgotPasswordTemplate(
      user.fullName,
      user.username,
      emailVerificationUrl,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password reset link has been sent to your email successfully. Please check your email to reset your password.",
      ),
    );
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const verificationToken = req.params.verificationToken as string;
  const { password } = req.body;

  if (!verificationToken) {
    throw new ApiError(400, "Reset token is required");
  }

  if (!password) {
    throw new ApiError(400, "New password is required");
  }

  const hashedToken = hashToken(verificationToken);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      refreshToken: null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized User");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { fullName, username } = req.body;

  let imageUrl: string | undefined;

  if (req.file) {
    if (user?.image) {
      await deleteFromCloudinary(user.image);
    }
    imageUrl = await uploadToCloudinary(req.file.buffer);
  }

  if (username) {
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing && existing.id !== userId) {
      throw new ApiError(
        400,
        "Username already taken, please try with another one",
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(fullName && { fullName }),
      ...(username && { username }),
      ...(imageUrl && { image: imageUrl }),
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      image: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "User profile updated successfully",
      ),
    );
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    throw new ApiError(
      400,
      "New password must be different from current password",
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      refreshToken: null,
    },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new ApiResponse(
        200,
        null,
        "Password changed successfully. Please login again.",
      ),
    );
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const search = (req.query.search as string) || "";

  const role = req.query.role as "ADMIN" | "USER" | undefined;

  const sortBy = (req.query.sortBy as string) || "createdAt";
  const order = (req.query.order as "asc" | "desc") || "desc";

  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(role && {
      role,
    }),
  };

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        image: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    }),

    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      "Users fetched successfully",
    ),
  );
});

export {
  changePassword,
  forgotPassword,
  getAllUsers,
  getUserProfile,
  login,
  logout,
  refreshAccessToken,
  register,
  resendVerificationEmail,
  resetPassword,
  updateUserProfile,
  verifyEmail,
};
