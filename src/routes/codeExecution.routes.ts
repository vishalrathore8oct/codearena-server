import { Router } from "express";
import { codeExecution } from "../controllers/execution.controllers.js";
import { requireAuth } from "../middlewares/authentication.middleware.js";

const codeExecutionRoutes = Router();

codeExecutionRoutes.post("/", requireAuth, codeExecution);

export default codeExecutionRoutes;
