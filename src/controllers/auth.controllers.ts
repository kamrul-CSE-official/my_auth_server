import { Request, Response } from "express";
import authServices from "../services/auth.services";
import { createAccessToken, createRefreshToken } from "../utils/jwtToken";
import User from "../models/user.model";

const signUpUser = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const userExists = await User.isUserExist(req.body.email);
    if (userExists) {
      res.status(400).json({ message: "Email is already taken" });
      return;
    }

    const result = await authServices.signUpUser(req.body, req.file);

    res.status(200).json({
      status: 200,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ status: 500, message: errorMessage });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authServices.login(req.body);
    if (result) {
      const { name, email, img, role } = result;
      const refreshToken = await createRefreshToken({ name, email, img, role });
      const accessToken = await createAccessToken({ name, email, img, role });

      // Set refreshToken as a cookie with expiry date 60 days
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
        secure: true, // Set to true if using HTTPS
      });

      res.status(200).json({
        status: 200,
        message: "Login successful.",
        data: { accessToken: accessToken },
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "Login failed, invalid credentials!",
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ status: 500, message: errorMessage });
  }
};

const forgetPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await authServices.forgetPasswordService(req.body);
    res
      .status(500)
      .json({ status: 500, message: "Forget password done", data: result });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ status: 500, message: errorMessage });
  }
};

const authControllers = {
  signUpUser,
  login,
  forgetPasswordController,
};

export default authControllers;


