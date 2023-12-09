"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./config/logger"));
dotenv_1.default.config();
const port = process.env.PORT || 6000;
const DB = (_a = process.env.DB) === null || _a === void 0 ? void 0 : _a.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB, {})
    .then(() => logger_1.default.info("DB connection successful! " + "🚀🚀"));
const server = app_1.default.listen(port, () => {
    logger_1.default.info("server running on port " + port + " 🚀🚀");
});
process.on("unhandledRejection", (err) => {
    logger_1.default.error("UNHANDLED REJECTION! 💥 Shutting down...");
    logger_1.default.error(err);
    server.close(() => {
        process.exit(1);
    });
});
process.on("SIGTERM", () => {
    logger_1.default.error("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        logger_1.default.error("💥 Process terminated!");
    });
});
