import User, { IUser } from "../models/user.model";

const signUpUser = async (data: IUser): Promise<IUser | null> => {
  try {
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

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  try {
    const { email, newPassword } = payload;
    const user = await User.isUserExist(email);
    if (!user) {
      throw new Error("User not found");
    }
    console.log("Reset....", payload, user);
  } catch (error) {
    throw new Error(
      "Something went wrong during reset password. Please try again."
    );
  }
};

const authServices = {
  signUpUser,
  login,
  resetPassword,
};

export default authServices;
