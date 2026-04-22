import morgan from "morgan";
import { env } from "../config/env.js";
import logger from "./winston.logger.js";

const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

const skip = () => env.NODE_ENV !== "development";

const morganMiddleware = morgan(":method :url :status :response-time ms", {
  stream,
  skip,
});

export default morganMiddleware;
