import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import morganMiddleware from "./logger/morgan.logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import {
  swaggerDocument,
  swaggerUi,
} from "./middlewares/swagger.middleware.js";
import { validate } from "./middlewares/validate.middleware.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { registerSchema } from "./validations/user.validation.js";

const app = express();

app.use(morganMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.CORS_ORIGINS === "*"
        ? "*"
        : process.env.CORS_ORIGINS?.split(","),
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to CodeArena Backend!");
});

app.get("/error", () => {
  throw new Error("Test error 🚨");
});

app.get(
  "/async-error",
  asyncHandler(async () => {
    throw new Error("Async error 🚨");
  }),
);

app.get("/async-broken", async () => {
  await Promise.reject(new Error("Boom 💥"));
});

app.get("/test-apierror", () => {
  throw new ApiError(500, "Bad Request");
});

app.get("/user", (req, res) => {
  const user = { id: 1, name: "Vishal" };
  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

app.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    return res.json(new ApiResponse(201, req.body, "User registered"));
  }),
);

app.use(errorHandler);

export default app;
