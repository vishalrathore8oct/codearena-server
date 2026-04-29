import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../constant.js";
import { ApiError } from "../utils/ApiError.utils.js";

const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role!)) {
      throw new ApiError(403, "Forbidden: Access denied");
    }

    next();
  };
};

export { authorize };
