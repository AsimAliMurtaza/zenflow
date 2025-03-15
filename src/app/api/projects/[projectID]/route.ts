import { NextResponse } from "next/server";
import Project from "@/models/Project";
import connectDB from "@/lib/mongodb";

// GET project details
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  await connectDB();
  const project = await Project.findById(params.projectId)
    .populate("assignedTeam")
    .populate("tasks.assignedTo")
    .populate("sprints.tasks");
  return NextResponse.json(project);
}

// POST add a task to the project
export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  await connectDB();
  const { title, description, assignedTo, dueDate } = await request.json();

  const task = { title, description, assignedTo, dueDate };
  const project = await Project.findByIdAndUpdate(
    params.projectId,
    { $push: { tasks: task } },
    { new: true }
  );

  return NextResponse.json(project);
}

// PUT update project status
export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  await connectDB();
  const { status } = await request.json();

  const project = await Project.findByIdAndUpdate(
    params.projectId,
    { status },
    { new: true }
  );

  return NextResponse.json(project);
}
