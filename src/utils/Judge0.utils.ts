import axios from "axios";
import { env } from "../config/env.js";
import type { Judge0Result, Judge0Submission } from "../types/judge0.types.js";
import { ApiError } from "./ApiError.utils.js";

const getJudge0LanguageId = (language: string): number => {
  const languageMap: { [key: string]: number } = {
    JAVA: 62,
    JAVASCRIPT: 63,
    PYTHON: 71,
  } as const;

  const languageId = languageMap[language.toUpperCase()];
  if (!languageId) {
    throw new ApiError(400, `Unsupported language: ${language}`);
  }
  return languageId;
};

const getJudge0LanguageName = (languageId: number): string => {
  const languageMap: { [key: number]: string } = {
    62: "JAVA",
    63: "JAVASCRIPT",
    71: "PYTHON",
  } as const;

  const languageName = languageMap[languageId];
  if (!languageName) {
    throw new ApiError(400, `Unsupported language ID: ${languageId}`);
  }
  return languageName;
};

const createJudge0SubmissionBatch = async (submissions: Judge0Submission[]) => {
  const { data } = await axios.post(
    `${env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    },
  );
  return data;
};

const pollingJudge0SubmissionBatchResult = async (tokens: string[]) => {
  while (true) {
    const { data } = await axios.get(
      `${env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
      {
        params: {
          tokens: tokens.join(","),
        },
      },
    );

    const result = data.submissions;

    const isAllDone = result.every(
      (result: Judge0Result) => result.status.id >= 3,
    );
    if (isAllDone) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

export {
  createJudge0SubmissionBatch,
  getJudge0LanguageId,
  getJudge0LanguageName,
  pollingJudge0SubmissionBatchResult,
};
