import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import envConfig from "../configs/envConfig";

// Define interfaces
export type IUser = {
  name: string;
  email: string;
  img?: string;
  password: string;
  role?: string;
};

export type IUserDocument = IUser & Document;

export type IUserModel = {
  isUserExist(email: string): Promise<IUserDocument | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUserDocument>;

// Define User Schema
const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    img: { type: String, default: "https://i.ibb.co/bP8sJzJ/user.png" },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: { type: String, default: "General" },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre<IUserDocument>("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const saltRounds = Number(envConfig.bcrypt) || 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// Static methods
userSchema.statics.isUserExist = function (email: string) {
  return this.findOne({ email }).select("name img password email _id role");
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
) {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Create and export User model
const User = model<IUserDocument, IUserModel>("User", userSchema);
export default User;
