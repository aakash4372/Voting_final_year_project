// src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    // Extract token from cookie
    const token = req.cookies.token;
    if (!token) {
      console.error("Auth middleware: No token provided");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      console.error("Auth middleware: Invalid token payload");
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Fetch user from database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.error(`Auth middleware: User not found for ID ${decoded.id}`);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    res.status(500).json({ message: "Server error in authentication", error: error.message });
  }
};

export default auth;