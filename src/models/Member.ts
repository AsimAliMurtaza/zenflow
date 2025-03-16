// models/Member.ts
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "member" },
});

export default mongoose.models.Member || mongoose.model("Member", memberSchema);