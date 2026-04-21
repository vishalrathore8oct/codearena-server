import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import logger from "./logger/winston.logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const startServer = () => {
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running at http://localhost:${PORT}/health-check`);
    logger.info(`📜 Swagger at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
