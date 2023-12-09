import express from "express";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { globalErrorHandler } from "./controller/errorController";
import AppError from "./utils/appError";
import userRouter from "./routes/userRoutes";
const app = express();

// morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// parse json request url
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// mongo sanitize
app.use(mongoSanitize());

// cookie parser
app.use(cookieParser());

// compression
app.use(compression());

// cors
app.use(cors);

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
