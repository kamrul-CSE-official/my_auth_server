import axios from "axios";
import FormData from "form-data";
import User, { IUser } from "../models/user.model";
import envConfig from "../configs/envConfig";
import { createPasswordResetToken } from "../utils/jwtToken";
import { sendEmail } from "../utils/sendResetMail";

const signUpUser = async (
  data: IUser,
  file: Express.Multer.File
): Promise<IUser | null> => {
  try {
    const form = new FormData();
    form.append("file", file.buffer, file.originalname);
    form.append("key", envConfig.fileUploadKey as string);

    const response = await axios.post(envConfig.fileUploadAPI as string, form, {
      headers: form.getHeaders(),
    });

    data.img = response.data.fileUrl;

    // Create new user
    const newUser = await User.create(data);
    return newUser;
  } catch (error: any) {
    throw new Error("Something went wrong during signup. Please try again.");
  }
};

const login = async (data: {
  email: string;
  password: string;
}): Promise<IUser | false> => {
  try {
    const { email, password } = data;
    const user = await User.isUserExist(email);
    if (!user || !(await User.isPasswordMatched(password, user.password))) {
      return false;
    }

    return user;
  } catch (error) {
    throw new Error("Something went wrong during login. Please try again.");
  }
};

const forgetPasswordService = async ({ email }: { email: string }) => {
  try {
    const user = await User.isUserExist(email);
    if (!user || !email) {
      throw new Error("User not found");
    }

    const payload = { name: user.name, email: user.email, img: user.img };
    const passResetToken = createPasswordResetToken(payload);
    const resetLink: string = `${envConfig.clientSiteUrl}/resetPassword?token=${passResetToken}`;
    console.log("Reset link:", resetLink);
    // sendEmail();

    // // Send the reset link to the user's email
    // await sendEmail({
    //   to: user.email,
    //   subject: "Password Reset",
    //   text: `Dear ${user.name},\n\nYou requested to reset your password. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.`,
    // });
  } catch (error) {
    throw new Error(
      "Something went wrong during reset password. Please try again."
    );
  }
};

const authServices = {
  signUpUser,
  login,
  forgetPasswordService,
};

export default authServices;
