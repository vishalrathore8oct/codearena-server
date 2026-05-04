import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

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
        "Submissions retrieved successfully",
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
          "Submissions for the problem retrieved successfully",
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
          "Count of submissions for the problem retrieved successfully",
        ),
      );
  },
);

export {
  getAllSubmissions,
  getCountOfSubmissionsForProblem,
  getSubmissionsForProblem,
};
