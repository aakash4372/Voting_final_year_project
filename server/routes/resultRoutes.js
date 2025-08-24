import express from "express";
import auth from "../middleware/auth.js";
import { calculateResults, getResults } from "../controllers/resultController.js";

const router = express.Router();

router.post("/:electionId/calculate", auth, calculateResults);
router.get("/:electionId", auth, getResults);

export default router;
