import type { CookieOptions } from "express";

const appName = "CodeArena";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export { appName, cookieOptions, USER_ROLES };
export type { UserRole };
