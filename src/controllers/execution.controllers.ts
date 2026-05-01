import type { Request, Response } from "express";
import type { Judge0Response } from "../types/judge0.types.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import {
  createJudge0SubmissionBatch,
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

  console.log("problemId", problemId);
  console.log("pollingSubmissionResult", pollingSubmissionResult);

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Code executed successfully",
  });
});

export { codeExecution };
