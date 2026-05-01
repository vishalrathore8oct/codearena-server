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

    tags: z.array(z.string().min(1)).min(1, "At least one tag required"),

    hints: z.array(z.string().min(1)).min(1, "At least one hint required"),

    constraints: z
      .array(z.string().min(1))
      .min(1, "At least one constraint required"),

    editorial: z.string().optional().nullable(),

    examples: z.array(exampleSchema).min(1, "At least one example required"),

    testcases: z.array(testcaseSchema).min(1, "At least one testcase required"),

    codeSnippets: codeSnippetsSchema,

    referenceSolutions: referenceSolutionsSchema,
  }),
});

export { createProblemSchema };
