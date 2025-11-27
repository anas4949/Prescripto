// backend/fixStatus.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import doctorModel from "./models/doctorModel.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const res = await doctorModel.updateMany(
      { status: { $exists: false } },    // those without status
      { $set: { status: "approved" } }   // mark approved
    );

    console.log("Updated documents:", res.modifiedCount);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();
