"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_services_1 = __importDefault(require("../services/auth.services"));
const jwtToken_1 = require("../utils/jwtToken");
const signUpGeneralUser = async (req, res) => {
    try {
        const { body: newData } = req;
        const result = await auth_services_1.default.signUpGeneralUser(newData);
        res.status(200).json({
            status: 200,
            message: "Account created successfully",
            data: result,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ status: 500, message: errorMessage });
    }
};
const login = async (req, res) => {
    try {
        const result = await auth_services_1.default.login(req.body);
        if (result) {
            const { name, email, img, role } = result;
            const refreshToken = await (0, jwtToken_1.createRefreshToken)({ name, email, img, role });
            const accessToken = await (0, jwtToken_1.createAccessToken)({ name, email, img, role });
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
        }
        else {
            res.status(401).json({
                status: 401,
                message: "Login failed. Invalid credentials.",
            });
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({ status: 500, message: errorMessage });
    }
};
const authControllers = {
    signUpGeneralUser,
    login,
};
exports.default = authControllers;
