import { z } from "zod";

const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

const problemIdParamSchema = z.object({
  id: z.uuid("Invalid problem ID format"),
});

const nonEmptyStringSchema = z.string().trim().min(1, "Field is required");

const testcaseSchema = z.object({
  input: nonEmptyStringSchema,
  output: nonEmptyStringSchema,
});

const exampleSchema = z.object({
  input: nonEmptyStringSchema,
  output: nonEmptyStringSchema,
  explanation: nonEmptyStringSchema,
});

const codeSnippetsSchema = z.object({
  JAVASCRIPT: nonEmptyStringSchema,
  PYTHON: nonEmptyStringSchema,
  JAVA: nonEmptyStringSchema,
});

const referenceSolutionsSchema = z.object({
  JAVASCRIPT: nonEmptyStringSchema,
  PYTHON: nonEmptyStringSchema,
  JAVA: nonEmptyStringSchema,
});

const createProblemSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must not exceed 200 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),

    difficulty: difficultyEnum,

    tags: z.array(nonEmptyStringSchema).min(1, "At least one tag is required"),

    hints: z
      .array(nonEmptyStringSchema)
      .min(1, "At least one hint is required"),

    constraints: z
      .array(nonEmptyStringSchema)
      .min(1, "At least one constraint is required"),

    editorial: z.string().trim().optional().nullable(),

    examples: z.array(exampleSchema).min(1, "At least one example is required"),

    testcases: z
      .array(testcaseSchema)
      .min(1, "At least one testcase is required"),

    codeSnippets: codeSnippetsSchema,

    referenceSolutions: referenceSolutionsSchema,
  }),
});

const updateProblemSchema = z.object({
  params: problemIdParamSchema,
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must not exceed 200 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .optional(),

    difficulty: difficultyEnum.optional(),

    tags: z
      .array(nonEmptyStringSchema)
      .min(1, "At least one tag is required")
      .optional(),

    hints: z
      .array(nonEmptyStringSchema)
      .min(1, "At least one hint is required")
      .optional(),

    constraints: z
      .array(nonEmptyStringSchema)
      .min(1, "At least one constraint is required")
      .optional(),

    editorial: z.string().trim().optional().nullable(),

    examples: z
      .array(exampleSchema)
      .min(1, "At least one example is required")
      .optional(),

    testcases: z
      .array(testcaseSchema)
      .min(1, "At least one testcase is required")
      .optional(),

    codeSnippets: codeSnippetsSchema.partial().optional(),

    referenceSolutions: referenceSolutionsSchema.partial().optional(),
  }),
});

const getProblemByIdSchema = z.object({
  params: problemIdParamSchema,
});

const deleteProblemByIdSchema = z.object({
  params: problemIdParamSchema,
});

export {
  createProblemSchema,
  deleteProblemByIdSchema,
  getProblemByIdSchema,
  updateProblemSchema,
};
