import express from "express";
import {
  loginDoctor,
  appointmentsDoctor,
  updateDoctorAvailability,
  doctorList,
  getDoctorById,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import { authDoctor } from "../middlewares/authDoctor.js";

const router = express.Router();

// Login
router.post("/login", loginDoctor);

// Protected routes
router.get("/appointments", authDoctor, appointmentsDoctor);
router.post("/availability", authDoctor, updateDoctorAvailability);
router.post("/complete-appointment", authDoctor, appointmentComplete);
router.post("/cancel-appointment", authDoctor, appointmentCancel);

// Dashboard Route
router.get("/dashboard", authDoctor, doctorDashboard);

// Profile routes (must be before dynamic :id)
router.get("/profile", authDoctor, doctorProfile);
router.post("/update-profile", authDoctor, updateDoctorProfile);

// Public/Admin
router.get("/all-doctors", doctorList);

// Dynamic route MUST BE LAST
router.get("/:id", getDoctorById);

export default router;
