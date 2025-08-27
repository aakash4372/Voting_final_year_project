import CandidateVoting from "../models/CandidateVoting.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Result from "../models/Result.js";
import mongoose from "mongoose";

// Create a new candidate voting record
export const createCandidateVoting = async (req, res) => {
  try {
    const { election, candidates } = req.body;

    // Validate inputs
    if (!election || !candidates || !Array.isArray(candidates)) {
      return res.status(400).json({ message: "Election ID and candidates array are required" });
    }

    // Validate election ID
    if (!mongoose.Types.ObjectId.isValid(election)) {
      return res.status(400).json({ message: "Invalid election ID" });
    }

    // Check if election exists
    const electionExists = await Election.findById(election);
    if (!electionExists) {
      return res.status(400).json({ message: "Election not found" });
    }

    // Validate candidate IDs and ensure they belong to the election
    for (const cand of candidates) {
      if (!mongoose.Types.ObjectId.isValid(cand.candidate)) {
        return res.status(400).json({ message: `Invalid candidate ID: ${cand.candidate}` });
      }
      const candidateExists = await Candidate.findOne({
        _id: cand.candidate,
        election,
      });
      if (!candidateExists) {
        return res.status(400).json({ message: `Candidate ${cand.candidate} not found in election` });
      }
    }

    // Create candidate voting record
    const candidateVoting = await CandidateVoting.create({
      election,
      candidates: candidates.map((cand) => ({
        candidate: cand.candidate,
        vote_count: cand.vote_count || 0,
      })),
      created_by: req.user.id,
    });

    // Populate related fields
    const populatedCandidateVoting = await candidateVoting.populate([
      { path: "election", select: "title" },
      { path: "candidates.candidate", select: "name image_url" },
      { path: "created_by", select: "name email" },
    ]);

    res.status(201).json(populatedCandidateVoting);
  } catch (error) {
    console.error("Error creating candidate voting record:", error);
    res.status(500).json({ message: "Error creating candidate voting record", error: error.message });
  }
};

// Get all candidate voting records
export const getCandidateVotings = async (req, res) => {
  try {
    const candidateVotings = await CandidateVoting.find().populate([
      { path: "election", select: "title" },
      { path: "candidates.candidate", select: "name image_url" },
      { path: "result", select: "total_votes" },
      { path: "created_by", select: "name email" },
    ]);
    res.json(candidateVotings);
  } catch (error) {
    console.error("Error fetching candidate voting records:", error);
    res.status(500).json({ message: "Error fetching candidate voting records", error: error.message });
  }
};

// Get a single candidate voting record by ID
export const getCandidateVotingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate voting ID" });
    }

    const candidateVoting = await CandidateVoting.findById(id).populate([
      { path: "election", select: "title" },
      { path: "candidates.candidate", select: "name image_url" },
      { path: "result", select: "total_votes" },
      { path: "created_by", select: "name email" },
    ]);

    if (!candidateVoting) {
      return res.status(404).json({ message: "Candidate voting record not found" });
    }

    res.json(candidateVoting);
  } catch (error) {
    console.error("Error fetching candidate voting record:", error);
    res.status(500).json({ message: "Error fetching candidate voting record", error: error.message });
  }
};

// Update a candidate voting record
export const updateCandidateVoting = async (req, res) => {
  try {
    const { id } = req.params;
    const { candidates, result } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate voting ID" });
    }

    // Validate candidate IDs if provided
    if (candidates) {
      if (!Array.isArray(candidates)) {
        return res.status(400).json({ message: "Candidates must be an array" });
      }
      for (const cand of candidates) {
        if (!mongoose.Types.ObjectId.isValid(cand.candidate)) {
          return res.status(400).json({ message: `Invalid candidate ID: ${cand.candidate}` });
        }
        const candidateExists = await Candidate.findById(cand.candidate);
        if (!candidateExists) {
          return res.status(400).json({ message: `Candidate ${cand.candidate} not found` });
        }
      }
    }

    // Validate result ID if provided
    if (result && !mongoose.Types.ObjectId.isValid(result)) {
      return res.status(400).json({ message: "Invalid result ID" });
    }

    const updateFields = {};
    if (candidates) {
      updateFields.candidates = candidates.map((cand) => ({
        candidate: cand.candidate,
        vote_count: cand.vote_count || 0,
      }));
    }
    if (result) {
      updateFields.result = result;
    }

    const candidateVoting = await CandidateVoting.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate([
      { path: "election", select: "title" },
      { path: "candidates.candidate", select: "name image_url" },
      { path: "result", select: "total_votes" },
      { path: "created_by", select: "name email" },
    ]);

    if (!candidateVoting) {
      return res.status(404).json({ message: "Candidate voting record not found" });
    }

    res.json(candidateVoting);
  } catch (error) {
    console.error("Error updating candidate voting record:", error);
    res.status(500).json({ message: "Error updating candidate voting record", error: error.message });
  }
};

// Delete a candidate voting record
export const deleteCandidateVoting = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate voting ID" });
    }

    const candidateVoting = await CandidateVoting.findByIdAndDelete(id);
    if (!candidateVoting) {
      return res.status(404).json({ message: "Candidate voting record not found" });
    }

    res.json({ message: "Candidate voting record deleted" });
  } catch (error) {
    console.error("Error deleting candidate voting record:", error);
    res.status(500).json({ message: "Error deleting candidate voting record", error: error.message });
  }
};

// Calculate votes and update result
export const calculateCandidateVotes = async (req, res) => {
  try {
    const { electionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ message: "Invalid election ID" });
    }

    // Find candidate voting records for the election
    const candidateVoting = await CandidateVoting.findOne({ election: electionId });
    if (!candidateVoting) {
      return res.status(404).json({ message: "Candidate voting record not found for this election" });
    }

    // Aggregate vote counts
    const results = candidateVoting.candidates.map((cand) => ({
      candidate: cand.candidate,
      total_votes: cand.vote_count,
    }));

    // Update or create result records
    const updatedResults = await Promise.all(
      results.map(async (r) => {
        return await Result.findOneAndUpdate(
          { election: electionId, candidate: r.candidate },
          { total_votes: r.total_votes },
          { new: true, upsert: true }
        );
      })
    );

    // Update the candidate voting record with the result reference
    if (updatedResults.length > 0) {
      await CandidateVoting.findByIdAndUpdate(
        candidateVoting._id,
        { result: updatedResults[0]._id }, // Assuming one result for simplicity; adjust if multiple results
        { new: true }
      );
    }

    res.json(updatedResults);
  } catch (error) {
    console.error("Error calculating candidate votes:", error);
    res.status(500).json({ message: "Error calculating candidate votes", error: error.message });
  }
};