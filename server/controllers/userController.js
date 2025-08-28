import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Create User
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, department, image_url } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Verify department exists
    const Department = mongoose.model("Department");
    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) return res.status(400).json({ message: "Invalid department" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      department,
      image_url,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("department", "name year");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("department", "name year");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Update
// src/controllers/userController.js
export const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.department) {
      const Department = mongoose.model("Department");
      const deptExists = await Department.findById(updateData.department);
      if (!deptExists) return res.status(400).json({ message: "Invalid department" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user }); // Ensure no typos here
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Delete
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};