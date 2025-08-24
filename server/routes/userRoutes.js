import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createUser);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
