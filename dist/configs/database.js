"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = __importDefault(require("./envConfig"));
async function databaseConnection() {
    try {
        await mongoose_1.default.connect(envConfig_1.default.dbUrl);
        console.log("Database connected ✅");
    }
    catch (error) {
        console.error("Database connection error ⚠️:", error?.message);
        process.exit(1);
    }
}
exports.default = databaseConnection;
