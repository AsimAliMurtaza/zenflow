import * as mongoose from "mongoose";

const SprintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Reference to the Project model
  completion: { type: Number, default: 0 } // represents percent completion of tasks
});

const Sprint = mongoose.models?.Sprint || mongoose.model("Sprint", SprintSchema);
export default Sprint;
