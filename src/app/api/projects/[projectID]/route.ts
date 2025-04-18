import { NextResponse } from "next/server";
import Project from "@/models/Project";
import Sprint from "@/models/Sprint";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Task from "@/models/Task";

// Validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// GET project details
export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await dbConnect();
  if (!mongoose.models.Project) {
    mongoose.model("Project", Project.schema);
  }
  if (!mongoose.models.Task) {
    mongoose.model("Task", Task.schema);
  }

  if (mongoose.models.Sprint) {
    mongoose.model("Sprint", Sprint.schema);
  }

  const { projectID } = params;

  if (!isValidObjectId(projectID)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const project = await Project.findById(projectID)
      .populate({
        path: "sprints",
        populate: { path: "tasks" },
      })
      .lean(); // Make it a plain object

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("GET project error:", err);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// POST - Not appropriate here
export async function POST(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  console.log(params);
  console.log(request);
  return NextResponse.json(
    { error: "Use Sprint-specific route to add tasks" },
    { status: 400 }
  );
}

// PUT - Update project
export async function PUT(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await dbConnect();

  const { projectID } = params;
  const updateData = await request.json();

  if (!isValidObjectId(projectID)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectID,
      updateData,
      { new: true }
    ).lean();

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
