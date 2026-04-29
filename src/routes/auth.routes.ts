import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getAllUsers,
  getUserProfile,
  login,
  logout,
  refreshAccessToken,
  register,
  resendVerificationEmail,
  resetPassword,
  updateUserProfile,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/authentication.middleware.js";
import { authorize } from "../middlewares/authorization.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateProfileSchema,
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

authRoutes.get("/get-user-profile", requireAuth, getUserProfile);

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

authRoutes.post(
  "/reset-password/:verificationToken",
  validate(resetPasswordSchema),
  resetPassword,
);

authRoutes.patch(
  "/update-profile",
  requireAuth,
  upload.single("image"),
  validate(updateProfileSchema),
  updateUserProfile,
);

authRoutes.post(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  changePassword,
);

authRoutes.get(
  "/admin/get-all-users",
  requireAuth,
  authorize("ADMIN"),
  getAllUsers,
);

export default authRoutes;
