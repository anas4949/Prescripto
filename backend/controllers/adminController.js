import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// Add Doctor API
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // validate password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = uploadResult.secure_url;

    // delete local file
    fs.unlinkSync(imageFile.path);

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      Image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added Successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//  Admin Login API
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL.replace(/"/g, "") &&
      password === process.env.ADMIN_PASSWORD.replace(/"/g, "")
    ) {
      const token = jwt.sign({ email, role: "Admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get all doctors (for admin panel)
export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//  Change Doctor Status (Approve / Reject)
export const changeDoctorStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    if (!doctorId || status === undefined) {
      return res.json({ success: false, message: "Missing parameters" });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    doctor.available = status; 
    await doctor.save();

    res.json({
      success: true,
      message: `Doctor Availability  ${status}`,
    });
  } catch (error) {
    console.error("Error changing doctor status:", error);
    res.json({ success: false, message: error.message });
  }
};


export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await doctorModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Doctor deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointment list
 export const appointmentsAdmin = async (req, res) => {
  try {
    
    const appointments = await appointmentModel.find({})
    .populate("userData", "name email Image")
     
    res.json({success:true,appointments})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// API For Cancel the Appointment
export const appointmentCancel = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId;
    

    if (!appointmentId) return res.json({ success: false, message: "Missing appointment id" });

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) return res.json({ success: false, message: "Appointment not found" });

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
// API to get dashboard data for admin panel 
export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


