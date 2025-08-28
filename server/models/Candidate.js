import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image_url: { type: String, required: true },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    votes: { type: Number, default: 0 }, // Total votes for the election
  },
  { timestamps: true }
);

// Indexes for faster queries
candidateSchema.index({ election: 1 });
candidateSchema.index({ name: 1 });

export default mongoose.model("Candidate", candidateSchema);