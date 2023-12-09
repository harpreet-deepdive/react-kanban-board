"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const errorController_1 = require("./controller/errorController");
const appError_1 = __importDefault(require("./utils/appError"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
// morgan
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
// parse json request url
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// mongo sanitize
app.use((0, express_mongo_sanitize_1.default)());
// cookie parser
app.use((0, cookie_parser_1.default)());
// compression
app.use((0, compression_1.default)());
// cors
app.use(cors_1.default);
app.use("/api/v1/users", userRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.globalErrorHandler);
exports.default = app;
