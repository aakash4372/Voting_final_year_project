import express from "express";
import auth from "../middleware/auth.js";
import {
  createCandidateVoting,
  getCandidateVotings,
  getCandidateVotingById,
  updateCandidateVoting,
  deleteCandidateVoting,
  calculateCandidateVotes,
} from "../controllers/candidateVotingController.js";

const router = express.Router();

// Protected routes
router.post("/", auth, createCandidateVoting);
router.get("/", auth, getCandidateVotings);
router.get("/:id", auth, getCandidateVotingById);
router.put("/:id", auth, updateCandidateVoting);
router.delete("/:id", auth, deleteCandidateVoting);
router.post("/:electionId/calculate", auth, calculateCandidateVotes);

export default router;