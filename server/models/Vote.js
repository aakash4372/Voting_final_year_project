// src/models/Vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }, // Include if required
  createdAt: { type: Date, default: Date.now },
});

voteSchema.index({ election: 1, voter: 1 }); // Index for faster duplicate vote checks

export default mongoose.model("Vote", voteSchema);