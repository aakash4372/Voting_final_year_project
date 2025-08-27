import mongoose from "mongoose";

const voterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Voter", voterSchema);