"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    photo: {
        type: String,
        default: "default.jpg",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                console.log(el, this);
                // return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
});
// Define your custom isModified method and suppress the warning
userSchema.method("isModified", function (path) {
    // @ts-ignore: TS2339 - Property 'isModified' does not exist on type 'IUserModel'.
    return Document.prototype.isModified.call(this, path);
}, { suppressWarning: true });
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password"))
        return next();
    // Hash the password with cost of 12
    this.password = await bcrypt_1.default.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = "";
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt_1.default.compare(candidatePassword, userPassword);
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
