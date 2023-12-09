"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const getAll = (Model, selectOptions) => (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const features = new apiFeatures_1.default(Model.find(), req.query)
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
exports.getAll = getAll;
