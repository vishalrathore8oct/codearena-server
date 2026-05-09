import { z } from "zod";

const emailSchema = z.email("Invalid email address").toLowerCase().trim();

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .trim();

const tokenParamSchema = z.object({
  verificationToken: z.string().trim().min(1, "Verification token is required"),
});

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .trim(),

    email: emailSchema,

    password: passwordSchema,
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

const refreshAccessTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().trim().optional(),
    })
    .optional(),

  headers: z
    .object({
      authorization: z.string().trim().optional(),
    })
    .optional(),
});

const resendVerificationSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

const resetPasswordSchema = z.object({
  params: tokenParamSchema,
  body: z.object({
    password: passwordSchema,
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .trim()
      .optional(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .trim()
      .optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters")
      .trim(),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .trim(),
  }),
});

const verifyEmailSchema = z.object({
  params: tokenParamSchema,
});

const getAllUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    search: z.string().trim().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    sortBy: z.string().trim().optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

export {
  changePasswordSchema,
  forgotPasswordSchema,
  getAllUsersSchema,
  loginSchema,
  refreshAccessTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
};
