import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { MESSAGES } from "../constant.js";

const getAllSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const submissions = await prisma.submission.findMany({
    where: {
      userId: userId,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { submissions },
        MESSAGES.SUBMISSIONS_RETRIEVED_SUCCESSFULLY,
      ),
    );
});

const getSubmissionsForProblem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const problemId = req.params.problemId as string;

    const submissions = await prisma.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { submissions },
          MESSAGES.PROBLEM_SUBMISSIONS_RETRIEVED_SUCCESSFULLY,
        ),
      );
  },
);

const getCountOfSubmissionsForProblem = asyncHandler(
  async (req: Request, res: Response) => {
    const problemId = req.params.problemId as string;

    const submissionsCount = await prisma.submission.count({
      where: {
        problemId: problemId,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { submissionsCount },
          MESSAGES.SUBMISSION_COUNT_RETRIEVED_SUCCESSFULLY,
        ),
      );
  },
);

export {
  getAllSubmissions,
  getCountOfSubmissionsForProblem,
  getSubmissionsForProblem,
};
