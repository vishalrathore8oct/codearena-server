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
import authRoutes from "./routes/auth.routes.js";

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

app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    statusCode: 200,
    message: "Health check successful",
    timestamp: new Date().toLocaleString(),
  });
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;
