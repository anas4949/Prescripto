// ✅ Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config(); // Must be before any imports that use env vars

// ✅ Import dependencies
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// ✅ Routers
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js"; // ✅ fixed file name

// ✅ Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
console.log("✅ Cloudinary configured successfully");

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Default route check
app.get("/", (req, res) => {
  res.send("Prescripto Backend Running ✅");
});

// ✅ Use Routers
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/payment", paymentRouter);

// ✅ Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
