import express from "express";
import auth from "../middleware/auth.js";
import { castVote, getVotes } from "../controllers/voteController.js";

const router = express.Router();

router.post("/", auth, castVote);
router.get("/:electionId", auth, getVotes);

export default router;
