import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const getAllSubmissions = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const getSubmissionsForProblem = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const getCountOfSubmissionsForProblem = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

export {
  getAllSubmissions,
  getCountOfSubmissionsForProblem,
  getSubmissionsForProblem,
};
