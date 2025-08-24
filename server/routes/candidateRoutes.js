import express from "express";
import auth from "../middleware/auth.js";
import { createCandidate, getCandidates, deleteCandidate, updateCandidate } from "../controllers/candidateController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", auth, upload.single("image"), createCandidate);
router.get("/", auth, getCandidates);
router.delete("/:id", auth, deleteCandidate);
router.put("/:id", auth, upload.single("image"), updateCandidate); // New PUT route

export default router;