import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  verifyEmailSchema,
} from "../validations/auth.validation.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);

authRoutes.get(
  "/verify-email/:token",
  validate(verifyEmailSchema),
  verifyEmail,
);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

export default authRoutes;
