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
  assignedTo: { type: Schema.Types.ObjectId, ref: "Member" },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;
