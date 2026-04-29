import { Router } from "express";
import {
  createProblem,
  deleteProblemById,
  getAllProblems,
  getAllSolvedProblems,
  getProblemById,
  updateProblemById,
} from "../controllers/problem.controllers.js";
import { requireAuth } from "../middlewares/authentication.middleware.js";
import { authorize } from "../middlewares/authorization.middleware.js";

const problemRoutes = Router();

problemRoutes.post(
  "/create-problem",
  requireAuth,
  authorize("ADMIN"),
  createProblem,
);

problemRoutes.post("/get-all-problems", requireAuth, getAllProblems);

problemRoutes.post("/get-problem/:id", requireAuth, getProblemById);

problemRoutes.post(
  "/update-problem/:id",
  requireAuth,
  authorize("ADMIN"),
  updateProblemById,
);

problemRoutes.post(
  "/delete-problem/:id",
  requireAuth,
  authorize("ADMIN"),
  deleteProblemById,
);

problemRoutes.post(
  "/get-all-solved-problems",
  requireAuth,
  getAllSolvedProblems,
);

export default problemRoutes;
