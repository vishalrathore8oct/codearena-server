import bcrypt from "bcrypt";
import crypto from "crypto";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Prisma } from "../../generated/prisma/client.js";
import { env } from "../config/env.js";
import { appName, cookieOptions, MESSAGES } from "../constant.js";
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
    throw new ApiError(400, MESSAGES.USER_ALREADY_EXISTS);
  }

  const username = await generateUniqueUsernameForDB(fullName);

  const hashedPassword = await bcrypt.hash(password, 10);

  const { verificationToken, hashedToken, expiry } =
    generateEmailVerificationToken();
  const frontendUrl = env.FRONTEND_URL;

  const emailVerificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;

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
      new ApiResponse(201, { user }, MESSAGES.USER_REGISTERED_SUCCESSFULLY),
    );
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const verificationToken = req.params.verificationToken as string;

  if (!verificationToken) {
    throw new ApiError(400, MESSAGES.VERIFICATION_TOKEN_MISSING);
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
    throw new ApiError(400, MESSAGES.INVALID_OR_EXPIRED_VERIFICATION_TOKEN);
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
    .json(new ApiResponse(200, null, MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }

  if (!user.isEmailVerified) {
    throw new ApiError(401, MESSAGES.PLEASE_VERIFY_EMAIL_TO_LOGIN);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, MESSAGES.INVALID_EMAIL_OR_PASSWORD);
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
        MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
      ),
    );
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const tokenFromCookie = req.cookies?.refreshToken;
  const tokenFromBody = req.body?.refreshToken;
  const tokenFromHeader =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined;

  let incomingRefreshToken: string | undefined;

  if (tokenFromCookie) {
    incomingRefreshToken = tokenFromCookie;
  } else if (tokenFromBody) {
    incomingRefreshToken = tokenFromBody;
  } else if (tokenFromHeader) {
    incomingRefreshToken = tokenFromHeader;
  }

  if (!incomingRefreshToken) {
    throw new ApiError(401, MESSAGES.REFRESH_TOKEN_REQUIRED);
  }

  let decoded: AuthUser;

  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET,
    ) as AuthUser;
  } catch {
    throw new ApiError(401, MESSAGES.INVALID_OR_EXPIRED_REFRESH_TOKEN);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || !user.refreshToken) {
    throw new ApiError(401, MESSAGES.USER_NOT_FOUND_OR_NO_REFRESH_TOKEN);
  }

  const isValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);

  if (!isValid) {
    throw new ApiError(401, MESSAGES.REFRESH_TOKEN_MISMATCH);
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
        MESSAGES.ACCESS_TOKEN_REFRESHED_SUCCESSFULLY,
      ),
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  let userId: string | undefined;
  const tokenFromCookie = req.cookies?.refreshToken;
  const tokenFromBody = req.body?.refreshToken;
  const tokenFromHeader =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined;

  if (req.user?.id) {
    userId = req.user.id;
  } else {
    const token = tokenFromCookie || tokenFromBody || tokenFromHeader;
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
    .json(new ApiResponse(200, null, MESSAGES.USER_LOGGED_OUT_SUCCESSFULLY));
});

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, MESSAGES.UNAUTHORIZED);
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
    throw new ApiError(404, MESSAGES.USER_NOT_FOUND);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      MESSAGES.CURRENT_USER_PROFILE_FETCHED_SUCCESSFULLY,
    ),
  );
});

const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, MESSAGES.EMAIL_REQUIRED);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(404, MESSAGES.USER_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    const { verificationToken, hashedToken, expiry } =
      generateEmailVerificationToken();
    const frontendUrl = env.FRONTEND_URL;

    const emailVerificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;

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
          MESSAGES.VERIFICATION_EMAIL_RESENT_SUCCESSFULLY,
        ),
      );
  },
);

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, MESSAGES.EMAIL_REQUIRED);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, MESSAGES.PASSWORD_RESET_LINK_SENT_IF_EXISTS),
      );
  }

  const { verificationToken, hashedToken, expiry } =
    generateEmailVerificationToken();
  const frontendUrl = env.FRONTEND_URL;

  const resetPasswordUrl = `${frontendUrl}/reset-password/${verificationToken}`;

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
      resetPasswordUrl,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        MESSAGES.PASSWORD_RESET_LINK_SENT_SUCCESSFULLY,
      ),
    );
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const verificationToken = req.params.verificationToken as string;
  const { password } = req.body;

  if (!verificationToken) {
    throw new ApiError(400, MESSAGES.RESET_TOKEN_REQUIRED);
  }

  if (!password) {
    throw new ApiError(400, MESSAGES.NEW_PASSWORD_REQUIRED);
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
    throw new ApiError(400, MESSAGES.INVALID_OR_EXPIRED_RESET_TOKEN);
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
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, MESSAGES.PASSWORD_RESET_SUCCESSFULLY));
});

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { fullName, username } = req.body;

  let imageUrl: string | undefined;

  if (!userId) {
    throw new ApiError(401, MESSAGES.UNAUTHORIZED_USER);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, MESSAGES.USER_NOT_FOUND);
  }

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
      throw new ApiError(400, MESSAGES.USERNAME_ALREADY_TAKEN);
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
        MESSAGES.USER_PROFILE_UPDATED_SUCCESSFULLY,
      ),
    );
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    throw new ApiError(401, MESSAGES.UNAUTHORIZED);
  }

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, MESSAGES.CURRENT_AND_NEW_PASSWORD_REQUIRED);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, MESSAGES.USER_NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, MESSAGES.CURRENT_PASSWORD_INCORRECT);
  }

  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    throw new ApiError(400, MESSAGES.NEW_PASSWORD_MUST_BE_DIFFERENT);
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
    .json(new ApiResponse(200, null, MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY));
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
      MESSAGES.USERS_FETCHED_SUCCESSFULLY,
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
