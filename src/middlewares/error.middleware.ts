import type { NextFunction, Request, Response } from "express";
import logger from "../logger/winston.logger.js";

const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

export { errorHandler };
