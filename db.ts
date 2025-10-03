import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("error connecting to mongodb", error);
    process.exit(1);
  }
}
