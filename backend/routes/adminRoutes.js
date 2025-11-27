import express from "express";
import {
  addDoctor,
  adminLogin,
  allDoctors,
  changeDoctorStatus,deleteDoctor,appointmentsAdmin,appointmentCancel,adminDashboard
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
// import appointmentModel from "../models/appointmentModel.js";

const router = express.Router();

//  Admin login route
router.post("/login", adminLogin);

//  Add new doctor 
router.post("/add-doctor", upload.single("image"), addDoctor);

//  Get all doctors 
router.get("/all-doctors", allDoctors);

//  Change doctor status 
router.post("/change-doctor-status", changeDoctorStatus);

// Delete Doctor 
router.delete("/delete-doctor/:doctorId", authAdmin, deleteDoctor);

// AdminAppointments

router.get('/appointments', authAdmin, appointmentsAdmin)

// Cancel Appointment from Admin
router.post('/cancel-appointments', authAdmin, appointmentCancel)

// Admin Dashboard Data 

router.get('/dashboard', authAdmin, adminDashboard)


export default router;
