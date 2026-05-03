import { z } from "zod";
const codeExecutionSchema = z.object({
  body: z
    .object({
      sourceCode: z
        .string()
        .min(1, "Source code is required")
        .max(50000, "Source code too large"),

      languageId: z
        .number()
        .int("Language ID must be an integer")
        .positive("Language ID must be positive"),

      stdin: z
        .array(
          z
            .string()
            .min(1, "Each input testcase must be non-empty")
            .max(1000, "Input too large"),
        )
        .min(1, "At least one testcase input is required")
        .max(50, "Too many testcases (max 50)"),

      expectedOutput: z
        .array(
          z
            .string()
            .min(1, "Each expected output must be non-empty")
            .max(1000, "Output too large"),
        )
        .min(1, "Expected output is required")
        .max(50, "Too many expected outputs (max 50)"),

      problemId: z.uuid("Invalid problem ID format"),
    })
    .refine((data) => data.stdin.length === data.expectedOutput.length, {
      message: "stdin and expectedOutput must have same length",
      path: ["expectedOutput"],
    }),
});

export { codeExecutionSchema };
