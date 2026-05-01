import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import type { Judge0Response, Testcase } from "../types/judge0.types.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import {
  createJudge0SubmissionBatch,
  getJudge0LanguageId,
  pollingJudge0SubmissionBatchResult,
} from "../utils/Judge0.utils.js";

const createProblem = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    difficulty,
    tags,
    hints,
    constraints,
    editorial,
    examples,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(
      403,
      "Forbidden - User does not have the required role to create a problem",
    );
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    if (!solutionCode) {
      throw new ApiError(400, `Reference solution for ${language} is required`);
    }

    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      throw new ApiError(400, `Unsupported language: ${language}`);
    }

    if (!testcases || testcases.length === 0) {
      throw new ApiError(400, "At least one testcase is required");
    }

    const submissions = testcases.map((testcase: Testcase) => ({
      language_id: languageId,
      source_code: solutionCode,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submissionBatchResult =
      await createJudge0SubmissionBatch(submissions);

    const submissionBatchTokens = submissionBatchResult.map(
      (result: Judge0Response) => result.token,
    );

    const pollingSubmissionResult = await pollingJudge0SubmissionBatchResult(
      submissionBatchTokens,
    );

    for (let i = 0; i < pollingSubmissionResult.length; i++) {
      const result = pollingSubmissionResult[i];
      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for Language ${language}.`,
        );
      }
    }
  }

  const newProblem = await prisma.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      hints,
      constraints,
      editorial,
      examples,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId: req.user.id,
    },
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { problem: newProblem },
        "Problem created successfully",
      ),
    );
});

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
