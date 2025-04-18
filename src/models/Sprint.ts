import mongoose, { Schema } from "mongoose";

const SprintSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  project: { type: Schema.Types.ObjectId, ref: "Project" }, // Reference to the Project model
});

const Sprint = mongoose.models.Sprint || mongoose.model("Sprint", SprintSchema);
export default Sprint;
