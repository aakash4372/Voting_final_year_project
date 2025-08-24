import express from "express";
import auth from "../middleware/auth.js";
import { createElection, getElections, getElectionById, updateElection, deleteElection } from "../controllers/electionController.js";

const router = express.Router();

router.post("/", auth, createElection);
router.get("/", auth, getElections);
router.get("/:id", auth, getElectionById);
router.put("/:id", auth, updateElection);
router.delete("/:id", auth, deleteElection);

export default router;
