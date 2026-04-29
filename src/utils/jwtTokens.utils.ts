import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../constant.js";

const generateAccessToken = (userId: string, role: UserRole) => {
  return jwt.sign({ id: userId, role }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

const generateRefreshToken = (userId: string, role: UserRole) => {
  return jwt.sign({ id: userId, role }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

export { generateAccessToken, generateRefreshToken };
