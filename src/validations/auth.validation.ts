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
  body: z.object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .trim(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).trim().optional(),
    username: z.string().min(3).trim().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6, "Current password is required").trim(),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .trim(),
  }),
});

export {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateProfileSchema,
};
