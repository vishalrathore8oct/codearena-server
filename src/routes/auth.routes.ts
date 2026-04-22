import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validations/user.validation.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

export default authRoutes;
