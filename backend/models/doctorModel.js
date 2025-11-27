import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, requried: true, unique: true },
  password: { type: String, requried: true },
  Image: String,
  speciality: String,
  degree: String,
  experience: String,
  about: String,
  fees: Number,
  address: Object,
  status: { type: String, enum: ["pending","approved","rejected"], default: "approved" },
  available: { type: Boolean, default: true },
  slot_booked: { type: Object, default: {} },
  date: { type: Date, default: Date.now }
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;
