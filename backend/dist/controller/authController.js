"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../utils/appError"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "this is same", {
        expiresIn: process.env.JWT_EXPIRES_IN || "this is not ok",
    });
};
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const jwtCookieExpiresIn = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "1d", 10);
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
exports.signup = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const newUser = await userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, req, res);
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new appError_1.default("Please provide email and password!", 400));
    }
    // check if user exists and password is correct
    const user = await userModel_1.default.findOne({ email }).select("+password");
    if (!user ||
        !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.default("Incorrect email or password", 401));
    }
    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
});
