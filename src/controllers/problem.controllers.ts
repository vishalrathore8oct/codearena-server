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

const getAllProblems = asyncHandler(async (req: Request, res: Response) => {
  const problems = await prisma.problem.findMany();

  if (!problems || problems.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { problems: [] }, "No problems found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { problems }, "Problems retrieved successfully"),
    );
});

const getProblemById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const problem = await prisma.problem.findUnique({
    where: { id },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { problem }, "Problem retrieved successfully"));
});

const updateProblemById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

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
      "Forbidden - User does not have the required role to update a problem",
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

  const updatedProblem = await prisma.problem.update({
    where: { id },
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
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { problem: updatedProblem },
        "Problem updated successfully",
      ),
    );
});

const deleteProblemById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(
      403,
      "Forbidden - User does not have the required role to delete a problem",
    );
  }

  const problem = await prisma.problem.findUnique({
    where: { id },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  await prisma.problem.delete({
    where: { id },
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Problem deleted successfully"));
});

const getAllSolvedProblems = asyncHandler(
  async (req: Request, res: Response) => {
    const solvedProblems = await prisma.problem.findMany({
      where: {
        solvedProblems: {
          some: { userId: req.user.id },
        },
      },
      include: {
        solvedProblems: {
          where: { userId: req.user.id },
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { solvedProblems },
          "Solved problems retrieved successfully",
        ),
      );
  },
);

export {
  createProblem,
  deleteProblemById,
  getAllProblems,
  getAllSolvedProblems,
  getProblemById,
  updateProblemById,
};
