import mongoose from "mongoose";

const candidateVotingSchema = new mongoose.Schema(
  {
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidates_votes: [
      {
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",
          required: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    result_page_link: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CandidateVotingModel", candidateVotingSchema);