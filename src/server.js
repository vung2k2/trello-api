import express from "express";
import { env } from "./config/environment";
import { CONNECT_DB, GET_DB, CLOSE_DB } from "./config/mongodb";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import cors from "cors";

const START_SERVER = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server running at http://${env.APP_HOST}:${env.APP_PORT}/`);
  });
};

(async () => {
  try {
    console.log("Connecting to MongoDB Cloud Atlas!");
    await CONNECT_DB();
    console.log("Connected to MongoDB Cloud Atlas!");

    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

// Xử lý sự kiện thoát cho Windows
const gracefulShutdown = async () => {
  console.log("Received shutdown signal, closing connections...");
  await CLOSE_DB();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown); // Ctrl+C
process.on("SIGTERM", gracefulShutdown); // Tín hiệu từ hệ điều hành

// Bắt sự kiện 'exit' cho các trường hợp khác
process.on("exit", (code) => {
  console.log(`Process exited with code: ${code}`);
  gracefulShutdown();
});
