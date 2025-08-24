import Election from "../models/Election.js";

// Create
export const createElection = async (req, res) => {
  try {
    const election = await Election.create({ ...req.body, created_by: req.user.id });
    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: "Error creating election", error: error.message });
  }
};

// Read all
export const getElections = async (req, res) => {
  try {
    const elections = await Election.find().populate("created_by", "name email");
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching elections", error: error.message });
  }
};

// Read single
export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate("created_by", "name email");
    if (!election) return res.status(404).json({ message: "Election not found" });
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: "Error fetching election", error: error.message });
  }
};

// Update
export const updateElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!election) return res.status(404).json({ message: "Election not found" });
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: "Error updating election", error: error.message });
  }
};

// Delete
export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) return res.status(404).json({ message: "Election not found" });
    res.json({ message: "Election deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting election", error: error.message });
  }
};
