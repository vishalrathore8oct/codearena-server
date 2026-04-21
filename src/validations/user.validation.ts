import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .trim(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .trim()
      .toLowerCase(),

    email: z.email("Invalid email address").toLowerCase(),

    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export { registerSchema };
