import { Types } from "mongoose";

// Interface representing the user document
export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  photo: string;
  role: "user" | "admin";
  password: string | undefined | (Promise<string> & void);
  passwordConfirm: string;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
