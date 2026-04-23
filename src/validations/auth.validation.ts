import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .trim(),

    email: z.email("Invalid email address").toLowerCase(),

    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const verifyEmailSchema = z.object({
  params: z.object({
    token: z
      .string()
      .min(10, "Invalid token")
      .regex(/^[a-f0-9]+$/, "Token must be hex string"),
  }),
});

export { registerSchema, verifyEmailSchema };
