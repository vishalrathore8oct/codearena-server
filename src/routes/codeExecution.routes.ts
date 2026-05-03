import { Router } from "express";
import { codeExecution } from "../controllers/execution.controllers.js";
import { requireAuth } from "../middlewares/authentication.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { codeExecutionSchema } from "../validations/codeExecution.validation.js";

const codeExecutionRoutes = Router();

codeExecutionRoutes.post(
  "/",
  requireAuth,
  validate(codeExecutionSchema),
  codeExecution,
);

export default codeExecutionRoutes;
