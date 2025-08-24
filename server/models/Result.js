import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  total_votes: { type: Number, default: 0 }
});

export default mongoose.model("Result", resultSchema);
