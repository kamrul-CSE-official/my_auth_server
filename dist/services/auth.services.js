"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const signUpGeneralUser = async (data) => {
    try {
        const newUser = await user_model_1.default.create(data);
        return newUser;
    }
    catch (error) {
        throw new Error("Something went wrong during signup. Please try again.");
    }
};
const login = async (data) => {
    try {
        const { email, password } = data;
        const user = await user_model_1.default.isUserExist(email);
        if (!user || !(await user_model_1.default.isPasswordMatched(password, user.password))) {
            return false;
        }
        return user;
    }
    catch (error) {
        throw new Error("Something went wrong during login. Please try again.");
    }
};
const authServices = {
    signUpGeneralUser,
    login,
};
exports.default = authServices;
