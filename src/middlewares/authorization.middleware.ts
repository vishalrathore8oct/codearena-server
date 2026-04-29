import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../constant.js";
import { ApiError } from "../utils/ApiError.utils.js";

const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized - User not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Forbidden - User does not have the required role"),
      );
    }

    next();
  };
};

export { authorize };
