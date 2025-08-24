// src/routes/authRoutes.js
import express from "express";
import { register, login, logout, forgotPassword, verifyOTP, resetPassword, getUserInfo } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/user-info", auth, getUserInfo);
router.post("/logout", auth, logout);

export default router;
