import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.atoken;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fix: use "role" instead of "isAdmin"
    if (decoded.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied: Not an admin" });
    }

    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;
