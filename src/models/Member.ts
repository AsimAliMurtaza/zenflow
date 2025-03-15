import mongoose, { Schema } from "mongoose";

const MemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String },
});

// Register the model if it doesn't exist, otherwise reuse it
const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);

export default Member;