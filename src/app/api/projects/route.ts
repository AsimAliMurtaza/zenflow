import { NextResponse } from "next/server";
import Project from "@/models/Project";
import connectDB from "@/lib/mongodb";

// GET all projects
export async function GET() {
  await connectDB();
  const projects = await Project.find().populate("assignedTeam");
  return NextResponse.json(projects);
}

// POST a new project
export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const project = new Project(body);
  await project.save();
  return NextResponse.json(project);
}

// PUT update a project
export async function PUT(request: Request) {
  await connectDB();
  const { id, ...updateData } = await request.json();
  const project = await Project.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return NextResponse.json(project);
}

// DELETE a project
export async function DELETE(request: Request) {
  await connectDB();
  const { id } = await request.json();
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ message: "Project deleted" });
}
