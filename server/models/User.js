import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["voter", "admin", "candidate"], default: "voter" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  year: { type: String },
  image_url: { type: String },
  emailVerificationOTP: { type: String },
  emailVerificationExpires: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);