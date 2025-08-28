// src/routes/authRoutes.js
import express from "express";
import { register, login, logout, getUserInfo, verifyOTP, verifyEmail, resendOTP, forgotPassword, resetPassword } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword); // Added reset-password route

// Protected routes
router.get("/user-info", auth, getUserInfo);
router.post("/logout", auth, logout);

export default router;