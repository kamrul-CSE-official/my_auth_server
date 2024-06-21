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
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const user = await User.isUserExist(email);

    if (!user) {
      throw new Error("User not found");
    }

    const payload = { name: user.name, email: user.email, img: user.img };
    const passResetToken = createPasswordResetToken(payload);
    const resetLink = `${envConfig.clientSiteUrl}/resetPassword?token=${passResetToken}`;
    console.log("Reset link:", resetLink);

    await sendEmail(
      email,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">Hi, ${user.name}</p>
        <p style="color: #555;">
          We received a request to reset your password. Click the button below to reset your password:
        </p>
        <a href="${resetLink}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">
          Reset Password
        </a>
        <p style="color: #555;">
          If you did not request a password reset, please ignore this email or contact support if you have questions.
        </p>
        <p style="color: #555;">Thank you,</p>
        <p style="color: #555;">The Support Team | My-Auth | 01823855998</p>
      </div>
    `,
      "Reset password"
    );
  } catch (error) {
    console.error("Error in forgetPasswordService:", error);
    throw new Error(
      "Something went wrong during password reset. Please try again."
    );
  }
};

const authServices = {
  signUpUser,
  login,
  forgetPasswordService,
};

export default authServices;
