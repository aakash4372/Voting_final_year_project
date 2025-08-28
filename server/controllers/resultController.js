import Result from "../models/Result.js";
import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import mongoose from "mongoose";

// Calculate results for an election
export const calculateResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ message: "Invalid election ID" });
    }

    // Check if results already exist
    const existingResults = await Result.find({ election: electionId });
    if (existingResults.length > 0) {
      return res.json(existingResults);
    }

    // Aggregate votes by candidate
    const voteResults = await Vote.aggregate([
      { $match: { election: new mongoose.Types.ObjectId(electionId) } },
      { $group: { _id: "$candidate", total_votes: { $sum: 1 } } },
    ]);

    // Update or create Result documents
    const updatedResults = await Promise.all(
      voteResults.map(async (r) => {
        return await Result.findOneAndUpdate(
          { election: electionId, candidate: r._id },
          { total_votes: r.total_votes },
          { new: true, upsert: true }
        ).populate("candidate", "name image_url");
      })
    );

    console.log(`Results calculated for election ${electionId}:`, updatedResults);
    res.json(updatedResults);
  } catch (error) {
    console.error("Error calculating results:", error);
    res.status(500).json({ message: "Error calculating results", error: error.message });
  }
};

// Get results
export const getResults = async (req, res) => {
  try {
    const electionId = req.params.electionId;
    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ message: "Invalid election ID" });
    }

    // Fetch existing results
    const results = await Result.find({ election: electionId })
      .populate("candidate", "name image_url")
      .populate("election", "title");

    // Fetch all candidates for the election
    const candidates = await Candidate.find({ election: electionId }).select("name image_url _id");
    const resultMap = new Map(results.map((r) => [r.candidate._id.toString(), r]));

    // Include all candidates, even those with zero votes
    const allResults = candidates.map((candidate) => ({
      candidate: { _id: candidate._id, name: candidate.name, image_url: candidate.image_url },
      election: { _id: electionId, title: results[0]?.election?.title || "Unknown Election" },
      total_votes: resultMap.get(candidate._id.toString())?.total_votes || 0,
    }));

    console.log(`Results fetched for election ${electionId}:`, allResults);
    res.json(allResults);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
};