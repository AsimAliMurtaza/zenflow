import { NextResponse } from "next/server";
import Project from "@/models/Project";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Task from "@/models/Task";
import Sprint from "@/models/Sprint";

// GET project details
export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await connectDB();
  if (!mongoose.models.Project) {
    mongoose.model("Project", Project.schema);
  }
  if (!mongoose.models.Task) {
    mongoose.model("Task", Task.schema);
  }

  if (mongoose.models.Sprint) {
    mongoose.model("Sprint", Sprint.schema);
  }

  const project = await Project.findById(params.projectID)
    .populate("assignedTeam")
    .populate("tasks.assignedTo")
    .populate("sprints.tasks");
  return NextResponse.json(project);
}

// POST add a task to the project
export async function POST(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await connectDB();
  const { title, description, assignedTo, dueDate } = await request.json();

  const task = { title, description, assignedTo, dueDate };
  const project = await Project.findByIdAndUpdate(
    params.projectID,
    { $push: { tasks: task } },
    { new: true }
  );

  return NextResponse.json(project);
}
// PUT update a project
export async function PUT(request: Request) {
  try {
    await connectDB();

    // Parse the request body
    const { id, ...updateData } = await request.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Update the project
    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("assignedTeam");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
