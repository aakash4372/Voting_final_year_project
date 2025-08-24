import Department from "../models/Department.js";

// Create
export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create({ ...req.body, created_by: req.user.id });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: "Error creating department", error: error.message });
  }
};

// Read all
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("created_by", "name email");
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};

// Update
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error: error.message });
  }
};

// Delete
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error: error.message });
  }
};