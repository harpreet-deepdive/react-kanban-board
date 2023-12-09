import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUserDocument } from "../shared/interfaces";

interface IUserModel extends IUserDocument {
  isModified(path?: string): boolean;

  // Add other Mongoose methods here if needed
}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
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
      validator: function (el: string) {
        console.log(el, this);
        // return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
});

// Define your custom isModified method and suppress the warning
userSchema.method(
  "isModified",
  function (this: IUserDocument, path?: string): boolean {
    // @ts-ignore: TS2339 - Property 'isModified' does not exist on type 'IUserModel'.
    return Document.prototype.isModified.call(this, path);
  },
  { suppressWarning: true }
);

userSchema.pre("save", async function (this: IUserModel, next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password as string | Buffer, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = "";
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
