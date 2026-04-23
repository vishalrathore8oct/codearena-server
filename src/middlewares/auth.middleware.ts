import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload } from "../types/jwt.types.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;

      req.user = { id: decoded.id };

      next();
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token", error);
    }
  },
);

export { requireAuth };
