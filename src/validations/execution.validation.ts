import { z } from "zod";

const codeExecutionSchema = z.object({
  body: z
    .object({
      sourceCode: z
        .string()
        .trim()
        .min(1, "Source code is required")
        .max(50000, "Source code too large"),

      languageId: z
        .number({
          error: "Language ID is required",
        })
        .int("Language ID must be an integer")
        .positive("Language ID must be a positive number"),

      stdin: z
        .array(
          z
            .string()
            .max(1000, "Each input testcase must be at most 1000 characters"),
        )
        .min(1, "At least one input testcase is required")
        .max(50, "Too many testcases (maximum 50 allowed)"),

      expectedOutput: z
        .array(
          z
            .string()
            .max(1000, "Each expected output must be at most 1000 characters"),
        )
        .min(1, "At least one expected output is required")
        .max(50, "Too many expected outputs (maximum 50 allowed)"),

      problemId: z.uuid("Invalid problem ID format"),
    })
    .refine((data) => data.stdin.length === data.expectedOutput.length, {
      message: "stdin and expectedOutput must have the same number of items",
      path: ["expectedOutput"],
    }),
});

export { codeExecutionSchema };
