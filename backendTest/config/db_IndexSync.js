import mongoose from "mongoose";
import "dotenv/config";
import CollegeData from "../models/CollegeData.js";

const run = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await CollegeData.syncIndexes();
    console.log("✅ Indexes Synced");

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

export default run;
