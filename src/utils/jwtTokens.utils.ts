import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

export { generateAccessToken, generateRefreshToken };
