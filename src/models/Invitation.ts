import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  email: { type: String, required: true }, // Email of the invited user
  status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  invitedBy: { type: String, required: true }, // Email of the user who sent the invitation
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models?.Invitation ||
  mongoose.model("Invitation", InvitationSchema);