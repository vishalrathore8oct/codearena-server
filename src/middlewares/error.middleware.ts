import type { NextFunction, Request, Response } from "express";
import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
};

export { errorHandler };
