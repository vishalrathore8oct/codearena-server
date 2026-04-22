import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./logger/winston.logger.js";

const httpServer = http.createServer(app);

const startServer = () => {
  httpServer.listen(env.PORT, () => {
    logger.info(
      `🚀 Server running at http://localhost:${env.PORT}/health-check`,
    );
    logger.info(`📜 Swagger at http://localhost:${env.PORT}/api-docs`);
  });
};

startServer();
