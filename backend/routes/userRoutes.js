import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
} from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authUser, getProfile);

// ✅ Add this line (frontend fix)
router.get("/get-profile", authUser, getProfile);

router.post("/update-profile", authUser, upload.single("image"), updateProfile);
router.post("/book-appointment", authUser, bookAppointment);
router.get("/appointments", authUser, listAppointment);


router.post("/cancel-appointment", authUser, cancelAppointment);

export default router;
