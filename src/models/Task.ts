import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  dueDate: { type: Date },
  // assignedTo: { type: Schema.Types.ObjectId, ref: "Member" },
  assignedTo: [{ type: String }], // Reference to the Member model
  sprint: { type: Schema.Types.ObjectId, ref: "Sprint" },
  project: { type: Schema.Types.ObjectId, ref: "Project" }, // Reference to the Project model
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Task = mongoose.models?.Task || mongoose.model("Task", TaskSchema);
export default Task;