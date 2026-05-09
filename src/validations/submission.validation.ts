import { z } from "zod";

const problemIdParamSchema = z.object({
  problemId: z.uuid("Invalid problem ID format"),
});

const getSubmissionsForProblemSchema = z.object({
  params: problemIdParamSchema,
});

const getCountOfSubmissionsForProblemSchema = z.object({
  params: problemIdParamSchema,
});

export {
  getCountOfSubmissionsForProblemSchema,
  getSubmissionsForProblemSchema,
};
