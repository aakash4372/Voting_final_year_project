import express from "express";
import auth from "../middleware/auth.js";
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from "../controllers/departmentController.js";

const router = express.Router();

router.post("/", auth, createDepartment);
router.get("/", getDepartments);
router.put("/:id", auth, updateDepartment);
router.delete("/:id", auth, deleteDepartment);

export default router;
