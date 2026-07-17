import type { Request, Response } from "express";
import { MESSAGES } from "../constant.js";
import { prisma } from "../db/prisma.js";
import type { Judge0Response, TestCaseResult } from "../types/judge0.types.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import {
  createJudge0SubmissionBatch,
  getJudge0LanguageName,
  pollingJudge0SubmissionBatchResult,
} from "../utils/Judge0.utils.js";

const codeExecution = asyncHandler(async (req: Request, res: Response) => {
  const { sourceCode, languageId, stdin, expectedOutput, problemId, isSubmit } =
    req.body;

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expectedOutput) ||
    expectedOutput.length !== stdin.length
  ) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: MESSAGES.INVALID_OR_MISSING_TESTCASES,
    });
  }

  const submissions = stdin.map((input: string) => ({
    language_id: languageId,
    source_code: sourceCode,
    stdin: input,
  }));

  const submissionResult = await createJudge0SubmissionBatch(submissions);

  const submissionTokens = submissionResult.map(
    (result: Judge0Response) => result.token,
  );

  const pollingSubmissionResult =
    await pollingJudge0SubmissionBatchResult(submissionTokens);

  let isAllPassed = true;

  const testcaseResults = pollingSubmissionResult.map(
    (result: Judge0Response, index: number) => {
      const isPassed = result.stdout?.trim() === expectedOutput[index].trim();
      if (!isPassed) {
        isAllPassed = false;
      }
      return {
        testcase: index + 1,
        passed: isPassed,
        expectedOutput: expectedOutput[index],
        stdin: stdin[index],
        stdout: result.stdout,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} sec` : undefined,
      };
    },
  );

  if (!isSubmit) {
    const mockSubmission = {
      language: getJudge0LanguageName(languageId),
      sourceCode,
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(
        testcaseResults.map((result: TestCaseResult) => result.stdout),
      ),
      stderr: testcaseResults.some((result: TestCaseResult) => result.stderr)
        ? JSON.stringify(
            testcaseResults.map((result: TestCaseResult) => result.stderr),
          )
        : null,
      compileOutput: testcaseResults.some(
        (result: TestCaseResult) => result.compileOutput,
      )
        ? JSON.stringify(
            testcaseResults.map(
              (result: TestCaseResult) => result.compileOutput,
            ),
          )
        : null,
      status: isAllPassed ? "Accepted" : "Wrong Answer",
      memory: testcaseResults.some((result: TestCaseResult) => result.memory)
        ? JSON.stringify(
            testcaseResults.map((result: TestCaseResult) => result.memory),
          )
        : null,
      time: testcaseResults.some((result: TestCaseResult) => result.time)
        ? JSON.stringify(
            testcaseResults.map((result: TestCaseResult) => result.time),
          )
        : null,
      userId: req.user.id,
      problemId,
      testcaseResults: testcaseResults,
    };

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: MESSAGES.CODE_RUN_SUCCESSFULLY,
      submission: mockSubmission,
    });
  }

  const submission = await prisma.submission.create({
    data: {
      language: getJudge0LanguageName(languageId),
      sourceCode,
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(
        testcaseResults.map((result: Judge0Response) => result.stdout),
      ),
      stderr: testcaseResults.some((result: Judge0Response) => result.stderr)
        ? JSON.stringify(
            testcaseResults.map((result: Judge0Response) => result.stderr),
          )
        : null,
      compileOutput: testcaseResults.some(
        (result: Judge0Response) => result.compileOutput,
      )
        ? JSON.stringify(
            testcaseResults.map(
              (result: Judge0Response) => result.compileOutput,
            ),
          )
        : null,
      status: isAllPassed ? "Accepted" : "Wrong Answer",
      memory: testcaseResults.some((result: Judge0Response) => result.memory)
        ? JSON.stringify(
            testcaseResults.map((result: Judge0Response) => result.memory),
          )
        : null,
      time: testcaseResults.some((result: Judge0Response) => result.time)
        ? JSON.stringify(
            testcaseResults.map((result: Judge0Response) => result.time),
          )
        : null,
      userId: req.user.id,
      problemId,
    },
  });

  if (isAllPassed) {
    await prisma.solvedProblem.upsert({
      where: {
        userId_problemId: {
          userId: req.user.id,
          problemId,
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        problemId,
      },
    });
  }

  const testcaseResultswithSubmissionId = testcaseResults.map(
    (result: Judge0Response) => ({
      ...result,
      submissionId: submission.id,
    }),
  );

  await prisma.testCaseResult.createMany({
    data: testcaseResultswithSubmissionId,
  });

  const submissionWithTestCaseResults = await prisma.submission.findUnique({
    where: { id: submission.id },
    include: {
      testcaseResults: true,
    },
  });

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: MESSAGES.CODE_SUBMITTED_SUCCESSFULLY,
    submission: submissionWithTestCaseResults,
  });
});

export { codeExecution };
