import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .trim(),

    email: z.email("Invalid email address").toLowerCase().trim(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .trim(),
  }),
});

const verifyEmailSchema = z.object({
  params: z.object({
    verificationToken: z
      .string()
      .min(10, "Invalid verificationToken")
      .regex(/^[a-f0-9]+$/, "Token must be hex string"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").toLowerCase().trim(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .trim(),
  }),
});

const refreshTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().optional(),
    })
    .optional(),

  headers: z
    .object({
      authorization: z.string().optional(),
    })
    .optional(),
});

const resendVerificationSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").toLowerCase().trim(),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").toLowerCase().trim(),
  }),
});

const resetPasswordSchema = z.object({
  params: z.object({
    verificationToken: z
      .string()
      .min(10, "Invalid verificationToken")
      .regex(/^[a-f0-9]+$/, "Token must be hex string"),
  }),
  body: z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
};
