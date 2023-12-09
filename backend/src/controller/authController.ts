import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { IUserDocument } from "../shared/interfaces";
import { Types, Schema, ObjectId } from "mongoose";
import AppError from "../utils/appError";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();
const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "this is same", {
    expiresIn: process.env.JWT_EXPIRES_IN || "this is not ok",
  });
};

const createSendToken = (
  user: IUserDocument,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);
  const jwtCookieExpiresIn = parseInt(
    process.env.JWT_COOKIE_EXPIRES_IN || "1d",
    10
  );

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, req, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    console.log(email, password);

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    // check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      !(await user.correctPassword(password, user.password as string))
    ) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
  }
);
