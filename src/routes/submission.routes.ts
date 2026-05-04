import { Router } from "express";
import {
  getAllSubmissions,
  getCountOfSubmissionsForProblem,
  getSubmissionsForProblem,
} from "../controllers/submission.controllers.js";
import { requireAuth } from "../middlewares/authentication.middleware.js";

const submissionRoutes = Router();

submissionRoutes.get("/get-all-submissions", requireAuth, getAllSubmissions);

submissionRoutes.get(
  "/get-submissions-for-problem/:problemId",
  requireAuth,
  getSubmissionsForProblem,
);

submissionRoutes.get(
  "/get-count-of-submissions-for-problem/:problemId",
  requireAuth,
  getCountOfSubmissionsForProblem,
);

export default submissionRoutes;
