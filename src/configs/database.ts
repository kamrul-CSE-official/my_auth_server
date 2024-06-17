import mongoose from "mongoose";
import envConfig from "./envConfig";

async function databaseConnection() {
  try {
    await mongoose.connect(envConfig.dbUrl as string);
    console.log("Database connected ✅");
  } catch (error: any) {
    console.error("Database connection error ⚠️:", error?.message);
    process.exit(1);
  }
}

export default databaseConnection;
