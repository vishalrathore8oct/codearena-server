import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

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

app.get("/", (req, res) => {
  res.send("Welcome to CodeAreana Backend!");
});

export default app;
