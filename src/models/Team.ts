// models/Team.ts
import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: String }], // Array of strings (emails)
});

const Team = mongoose.models?.Team || mongoose.model("Team", TeamSchema);
export default Team;