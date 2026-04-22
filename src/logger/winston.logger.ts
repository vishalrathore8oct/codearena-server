import winston from "winston";
import { env } from "../config/env.js";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => (env.NODE_ENV === "development" ? "debug" : "warn");

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "magenta",
  debug: "white",
});

const format = winston.format.combine(
  winston.format.timestamp({ format: "DD MMM YYYY HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
  ),
);

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/info.log", level: "info" }),
    new winston.transports.File({ filename: "logs/http.log", level: "http" }),
  ],
});

export default logger;
