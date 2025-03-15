import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Almost Done"],
    default: "In Progress",
  },
  assignedTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  dueDate: { type: Date },
  completion: { type: Number, min: 0, max: 100, default: 0 },
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
