import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import envConfig from "../configs/envConfig";

// Define interfaces
export type IUser = {
  name: string;
  email: string | undefined;
  mobile: string | undefined;
  gender: "Male" | "Female" | "Other";
  img?: string;
  password: string;
  role?: string;
};

type IUserDocument = IUser & Document;
type IUserModel = {
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
      unique: [true, "Email must be unique"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
      unique: [true, "Mobile must be unique"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: { values: ["Male", "Female", "Other"], message: "Invalid gender" },
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
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, Number(envConfig.bcrypt));
  }
  next();
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
