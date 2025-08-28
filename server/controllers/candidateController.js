import Candidate from "../models/Candidate.js";
import mongoose from "mongoose";

// Add candidate
export const createCandidate = async (req, res) => {
  try {
    const { name, election } = req.body;

    if (!name || !election || !req.file) {
      return res.status(400).json({ message: "Name, election, and image are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(election)) {
      return res.status(400).json({ message: "Invalid election ID." });
    }

    const imageUrl = req.file.path;

    const candidate = await Candidate.create({
      name,
      image_url: imageUrl,
      election: new mongoose.Types.ObjectId(election),
      created_by: req.user._id,
    });

    // Fetch the created candidate with populated fields
    const populatedCandidate = await Candidate.findById(candidate._id)
      .populate("election", "title")
      .populate("created_by", "name email");

    res.status(201).json(populatedCandidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ message: "Error creating candidate", error: error.message });
  }
};

// Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, election } = req.body;
    let imageUrl;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate ID." });
    }

    const updateFields = { name };
    if (election) {
      if (!mongoose.Types.ObjectId.isValid(election)) {
        return res.status(400).json({ message: "Invalid election ID." });
      }
      updateFields.election = new mongoose.Types.ObjectId(election);
    }

    if (req.file) {
      imageUrl = req.file.path;
      updateFields.image_url = imageUrl;
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate("created_by", "name email")
      .populate("election", "title");

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    res.json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: "Error updating candidate", error: error.message });
  }
};

// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const { electionId } = req.query;
    const filter = electionId ? { election: new mongoose.Types.ObjectId(electionId) } : {};
    const candidates = await Candidate.find(filter)
      .populate("created_by", "name email")
      .populate("election", "title");
    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Error fetching candidates", error: error.message });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Candidate deleted" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Error deleting candidate", error: error.message });
  }
};