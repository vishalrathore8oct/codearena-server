import dotenv from "dotenv";
import http from "http";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const startServer = () => {
  httpServer.listen(PORT, () => {
    console.log(`⚙️  Server is running on port: ${PORT}
🌐 Server URL: http://localhost:${PORT}`);
  });
};

startServer();
