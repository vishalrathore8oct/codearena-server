import { Router } from "express";
import {
  getAllSubmissions,
  getCountOfSubmissionsForProblem,
  getSubmissionsForProblem,
} from "../controllers/submission.controllers.js";
import { requireAuth } from "../middlewares/authentication.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getCountOfSubmissionsForProblemSchema,
  getSubmissionsForProblemSchema,
} from "../validations/submission.validation.js";

const submissionRoutes = Router();

submissionRoutes.get("/get-all-submissions", requireAuth, getAllSubmissions);

submissionRoutes.get(
  "/get-submissions-for-problem/:problemId",
  requireAuth,
  validate(getSubmissionsForProblemSchema),
  getSubmissionsForProblem,
);

submissionRoutes.get(
  "/get-count-of-submissions-for-problem/:problemId",
  requireAuth,
  validate(getCountOfSubmissionsForProblemSchema),
  getCountOfSubmissionsForProblem,
);

export default submissionRoutes;
