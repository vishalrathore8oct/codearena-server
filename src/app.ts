import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import morganMiddleware from "./logger/morgan.logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.CORS_ORIGINS === "*"
        ? "*"
        : process.env.CORS_ORIGINS?.split(","),
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use(morganMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to CodeArena Backend!");
});

app.get("/error", () => {
  throw new Error("Test error 🚨");
});

app.use(errorHandler);

export default app;
