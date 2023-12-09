import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./config/logger";

dotenv.config();

const port = process.env.PORT || 6000;
const DB = process.env.DB?.replace(
  "<password>",
  process.env.DATABASE_PASSWORD as string
);

mongoose
  .connect(DB as string, {})
  .then(() => logger.info("DB connection successful! " + "🚀🚀"));

const server = app.listen(port, () => {
  logger.info("server running on port " + port + " 🚀🚀");
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  logger.error("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    logger.error("💥 Process terminated!");
  });
});
