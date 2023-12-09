import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import dotenv from "dotenv";

dotenv.config();

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
};
