import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
});

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;