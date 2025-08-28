import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Cast vote
export const castVote = async (req, res) => {
  try {
    const { election, candidate } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const voter = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(election) || !mongoose.Types.ObjectId.isValid(candidate)) {
      return res.status(400).json({ message: "Invalid election or candidate ID" });
    }

    // Check if the user has already voted in this election
    const existingVote = await Vote.findOne({ election, voter });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted in this election" });
    }

    // Fetch the user's department
    const user = await User.findById(voter).select("department");
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }
    if (!user.department) {
      return res.status(400).json({ message: "User is not associated with a department" });
    }

    // Create the vote entry
    const vote = await Vote.create({
      election: new mongoose.Types.ObjectId(election),
      candidate: new mongoose.Types.ObjectId(candidate),
      voter,
      department: user.department,
    });

    // Update candidate: increment votes
    await Candidate.findByIdAndUpdate(
      candidate,
      { $inc: { votes: 1 } }, // Increment votes field
      { new: true }
    );

    res.status(201).json({ message: "Vote cast successfully", vote });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ message: "Error casting vote", error: error.message });
  }
};

// Get votes for election
export const getVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ election: req.params.electionId })
      .populate("voter", "name email")
      .populate("candidate", "name");
    res.json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Error fetching votes", error: error.message });
  }
};