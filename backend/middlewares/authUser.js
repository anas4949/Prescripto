import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized, No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 Add this line
    req.userId = decoded.id;  

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.json({ success: false, message: "Invalid or Expired Token" });
  }
};
