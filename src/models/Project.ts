import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  assignedTeam: { type: String }, // Reference Team model
  dueDate: { type: String },
  completion: { type: Number, default: 0 },
  sprints: [{ type: Schema.Types.ObjectId, ref: "Sprint" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
