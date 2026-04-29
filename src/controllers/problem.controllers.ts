import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const createProblem = asyncHandler(async (_req: Request, _res: Response) => {});

const getAllProblems = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const getProblemById = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const updateProblemById = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const deleteProblemById = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

const getAllSolvedProblems = asyncHandler(
  async (_req: Request, _res: Response) => {},
);

export {
  createProblem,
  deleteProblemById,
  getAllProblems,
  getAllSolvedProblems,
  getProblemById,
  updateProblemById,
};
