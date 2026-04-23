import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  register,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
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

export default authRoutes;
