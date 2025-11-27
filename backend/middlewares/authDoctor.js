import jwt from "jsonwebtoken";

export const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers.dtoken || req.headers.Dtoken;
    if (!dtoken) return res.status(401).json({ success: false, message: "Token Missing" });

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.doctorId = decoded.id; // ✅ attach doctor ID
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};
