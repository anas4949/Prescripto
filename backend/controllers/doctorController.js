import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// ---------------------------------------------
// LOGIN DOCTOR
// ---------------------------------------------
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor)
      return res.json({ success: false, message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------
// GET APPOINTMENTS
// ---------------------------------------------
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctorId;

    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------
// UPDATE DOCTOR AVAILABILITY
// ---------------------------------------------
const updateDoctorAvailability = async (req, res) => {
  try {
    const docId = req.doctorId;

    const doctorData = await doctorModel.findById(docId);
    if (!doctorData)
      return res.json({ success: false, message: "Doctor not found" });

    doctorData.available = !doctorData.available;
    await doctorData.save();

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------
// DOCTOR LIST
// ---------------------------------------------
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({})
      .select("-password -email");

    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------
// GET DOCTOR BY ID
// ---------------------------------------------
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id).select("-password");
    if (!doctor)
      return res.json({ success: false, message: "Doctor not found" });

    res.json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------
// COMPLETE APPOINTMENT (TOKEN-BASED)
// ---------------------------------------------
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctorId;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });

      return res.json({
        success: true,
        message: "Appointment Completed",
      });
    }

    return res.json({
      success: false,
      message: "Mark Failed",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------------------------------------
// CANCEL APPOINTMENT (TOKEN-BASED)
// ---------------------------------------------
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.doctorId;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      return res.json({
        success: true,
        message: "Appointment Cancelled",
      });
    }

    return res.json({
      success: false,
      message: "Cancellation Failed",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API too get dashboard data for data panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctorId; // FIXED

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for doctor panel

const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId; // make sure auth middleware sets this

    const profileData = await doctorModel.findById(docId).select('-password');

    if (!profileData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, profileData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// API to Update Doctor Profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.doctorId; // From token middleware
    const { fees, address, available } = req.body; // From request body

    const updated = await doctorModel.findByIdAndUpdate(
      docId,
      { fees, address, available },
      { new: true } // Return the updated document
    );

    res.json({ success: true, message: 'Profile Updated', profileData: updated });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
  

export {
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
};
