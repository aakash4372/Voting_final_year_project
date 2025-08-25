import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["upcoming", "ongoing", "completed"], 
    default: "upcoming" 
  },
  created_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    immutable: true // 🔒 cannot be changed after creation
  }
}, { timestamps: true });

export default mongoose.model("Election", electionSchema);
