import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "Member" },
  dueDate: { type: Date },
});

const SprintSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  assignedTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  tasks: [TaskSchema],
  sprints: [SprintSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
