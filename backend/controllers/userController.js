// controllers/userController.js
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing details" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Password too short" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// LOGIN (unchanged)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    // Expect req.userId set by your auth middleware
    const userData = await userModel.findById(req.userId).select("-password");
    if (!userData) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// UPDATE PROFILE (unchanged except using req.userId)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.json({ success: false, message: "Missing user ID" });

    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;
    if (address) {
      try {
        updateData.address = typeof address === "string" ? JSON.parse(address) : address;
      } catch {
        updateData.address = {};
      }
    }
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updateData.image = upload.secure_url;
    }
    await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// BOOK APPOINTMENT (keeps using req.userId)
export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId; // from auth middleware

    const docData = await doctorModel.findById(docId);
    if (!docData) return res.json({ success: false, message: "Doctor not found" });
    if (!docData.available)
      return res.json({ success: false, message: "Doctor not available" });

    const slotBooked = docData.slot_booked || {};
    const dateKey = slotDate;
    if (!slotBooked[dateKey]) slotBooked[dateKey] = [];

    if (slotBooked[dateKey].includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }

    // Book slot
    slotBooked[dateKey].push(slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slot_booked: slotBooked });

    // ✅ Fetch user data including image
    const userData = await userModel.findById(userId).select("name email image dob");

    if (!userData)
      return res.json({ success: false, message: "User not found" });

    // ✅ Prepare appointment data
    const appointmentData = {
      userId,
      docId,
      userData: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        image: userData.image || "", // ✅ Include user image if available
        age: userData.dob || "",
      },
      docData: {
        _id: docData._id,
        name: docData.name,
        Image: docData.Image,
        speciality: docData.speciality,
        degree: docData.degree,
        experience: docData.experience,
        fees: docData.fees,
        address: docData.address,
      },
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// LIST USER APPOINTMENTS - use req.userId (GET route)
export const listAppointment = async (req, res) => {
  try {
    const userId = req.userId; // ✅ get from auth middleware (not req.body)

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// CANCEL APPOINTMENT - use req.userId from middleware
export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId;
    const userId = req.userId;

    if (!appointmentId) return res.json({ success: false, message: "Missing appointment id" });

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) return res.json({ success: false, message: "Appointment not found" });

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // mark appointment cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // release the doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    if (!docData) return res.json({ success: false, message: "Doctor not found" });

    const slot_booked = docData.slot_booked || {};
    if (slot_booked[slotDate]) {
      slot_booked[slotDate] = slot_booked[slotDate].filter((t) => t !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId, { slot_booked });

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log("Cancel Appointment Error:", error);
    res.json({ success: false, message: error.message });
  }
};


