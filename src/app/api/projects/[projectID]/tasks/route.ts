import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

// GET all tasks for a project
export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await connectDB();
  const tasks = await Task.find({ project: params.projectID });
  return NextResponse.json(tasks);
}
// POST a new task for a project
export async function POST(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await connectDB();
  const { title, description, status, priority } = await request.json();

  const task = new Task({
    title,
    description,
    status,
    priority,
    project: params.projectID,
  });

  await task.save();
  return NextResponse.json(task);
}

// PUT update a task
export async function PUT(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await connectDB();
  console.log("params", params);
  const { id, title, description, status, priority } = await request.json();

  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, status, priority },
    { new: true }
  );

  return NextResponse.json(task);
}

// DELETE a task
export async function DELETE(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await connectDB();
  console.log("params", params);
  const { id } = await request.json();

  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted" });
}
