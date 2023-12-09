import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { NextFunction, Request, Response, RequestHandler } from "express";
import APIFeatures from "../utils/apiFeatures";
import { Document, Model, Schema } from "mongoose";

export const getAll = <T extends Document>(
  Model: Model<T>,
  selectOptions?: string
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields(selectOptions)
      .paginate();

    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
