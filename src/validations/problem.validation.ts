import { z } from "zod";

const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

const testcaseSchema = z.object({
  input: z.string().min(1),
  output: z.string().min(1),
});

const exampleSchema = z.object({
  input: z.string().min(1),
  output: z.string().min(1),
  explanation: z.string().min(1),
});

const codeSnippetsSchema = z.object({
  JAVASCRIPT: z.string().min(1),
  PYTHON: z.string().min(1),
  JAVA: z.string().min(1),
});

const referenceSolutionsSchema = z.object({
  JAVASCRIPT: z.string().min(1),
  PYTHON: z.string().min(1),
  JAVA: z.string().min(1),
});

const createProblemSchema = z.object({
  body: z.object({
    title: z.string().min(3).trim(),

    description: z.string().min(10).trim(),

    difficulty: difficultyEnum,

    tags: z.array(z.string().min(1)).min(1),

    hints: z.array(z.string().min(1)).min(1),

    constraints: z.array(z.string().min(1)).min(1),

    editorial: z.string().optional().nullable(),

    examples: z.array(exampleSchema).min(1),

    testcases: z.array(testcaseSchema).min(1),

    codeSnippets: codeSnippetsSchema,

    referenceSolutions: referenceSolutionsSchema,
  }),
});

const updateProblemSchema = z.object({
  body: z.object({
    title: z.string().min(3).trim().optional(),

    description: z.string().min(10).trim().optional(),

    difficulty: difficultyEnum.optional(),

    tags: z.array(z.string().min(1)).min(1).optional(),

    hints: z.array(z.string().min(1)).min(1).optional(),

    constraints: z.array(z.string().min(1)).min(1).optional(),

    editorial: z.string().optional().nullable(),

    examples: z.array(exampleSchema).min(1).optional(),

    testcases: z.array(testcaseSchema).min(1).optional(),

    codeSnippets: codeSnippetsSchema.partial().optional(),

    referenceSolutions: referenceSolutionsSchema.partial().optional(),
  }),
});

export { createProblemSchema, updateProblemSchema };
