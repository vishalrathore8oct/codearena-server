import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from "../validations/auth.validation.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);

authRoutes.get(
  "/verify-email/:verificationToken",
  validate(verifyEmailSchema),
  verifyEmail,
);

authRoutes.post("/login", validate(loginSchema), login);

authRoutes.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  refreshAccessToken,
);

authRoutes.post("/logout", requireAuth, logout);

authRoutes.get("/current-user", requireAuth, getCurrentUser);

authRoutes.post(
  "/resend-verification-email",
  validate(resendVerificationSchema),
  resendVerificationEmail,
);

authRoutes.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword,
);

export default authRoutes;
