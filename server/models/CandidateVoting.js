import mongoose from "mongoose";

const candidateVotingSchema = new mongoose.Schema({
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  candidates: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true,
      },
      vote_count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],
  result: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Result",
    required: false, // Optional, as results may be calculated later
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// Create indexes for faster queries
candidateVotingSchema.index({ election: 1 });
candidateVotingSchema.index({ "candidates.candidate": 1 });

export default mongoose.model("CandidateVoting", candidateVotingSchema);