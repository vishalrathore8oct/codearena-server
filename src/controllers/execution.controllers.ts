import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import type { Judge0Response } from "../types/judge0.types.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import {
  createJudge0SubmissionBatch,
  getJudge0LanguageName,
  pollingJudge0SubmissionBatchResult,
} from "../utils/Judge0.utils.js";

// Pending Controller Implementation - The actual implementation will happen in the next future commit.
const codeExecution = asyncHandler(async (req: Request, res: Response) => {
  const { sourceCode, languageId, stdin, expectedOutput, problemId } = req.body;

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expectedOutput) ||
    expectedOutput.length !== stdin.length
  ) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message:
        "Invalid or Missing testcases - 'stdin' and 'expectedOutput' must be non-empty arrays of the same length",
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

  const testCaseResults = pollingSubmissionResult.map(
    (result: Judge0Response, index: number) => {
      const isPassed = result.stdout?.trim() === expectedOutput[index].trim();
      if (!isPassed) {
        isAllPassed = false;
      }
      return {
        testCase: index + 1,
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

  const submission = await prisma.submission.create({
    data: {
      language: getJudge0LanguageName(languageId),
      sourceCode,
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(
        testCaseResults.map((result: Judge0Response) => result.stdout),
      ),
      stderr: testCaseResults.some((result: Judge0Response) => result.stderr)
        ? JSON.stringify(
            testCaseResults.map((result: Judge0Response) => result.stderr),
          )
        : null,
      compileOutput: testCaseResults.some(
        (result: Judge0Response) => result.compileOutput,
      )
        ? JSON.stringify(
            testCaseResults.map(
              (result: Judge0Response) => result.compileOutput,
            ),
          )
        : null,
      status: isAllPassed ? "Accepted" : "Wrong Answer",
      memory: testCaseResults.some((result: Judge0Response) => result.memory)
        ? JSON.stringify(
            testCaseResults.map((result: Judge0Response) => result.memory),
          )
        : null,
      time: testCaseResults.some((result: Judge0Response) => result.time)
        ? JSON.stringify(
            testCaseResults.map((result: Judge0Response) => result.time),
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

  const testCaseResultswithSubmissionId = testCaseResults.map(
    (result: Judge0Response) => ({
      ...result,
      submissionId: submission.id,
    }),
  );

  await prisma.testCaseResult.createMany({
    data: testCaseResultswithSubmissionId,
  });

  const submissionWithTestCaseResults = await prisma.submission.findUnique({
    where: { id: submission.id },
    include: {
      testCaseResults: true,
    },
  });

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Code executed successfully",
    submission: submissionWithTestCaseResults,
  });
});

export { codeExecution };
