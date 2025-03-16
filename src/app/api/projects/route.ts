import { NextResponse } from "next/server";
import Project from "@/models/Project";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// GET all projects
export async function GET() {
  try {
    await connectDB();

    // Ensure the Project model is registered
    if (!mongoose.models.Project) {
      mongoose.model("Project", Project.schema);
    }

    // Fetch all projects and populate assignedTeam
    const projects = await Project.find().populate("assignedTeam");
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
// POST a new project
export async function POST(request: Request) {
  try {
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Validate assignedTeam (if provided)
    if (body.assignedTeam && typeof body.assignedTeam !== "object") {
      return NextResponse.json(
        { error: "assignedTeam must be a Team object" },
        { status: 400 }
      );
    }

    // Create a new project
    const project = new Project(body);
    await project.save();

    // Return the created project
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    // Parse the query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    // Parse the request body
    const updateData = await request.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate assignedTeam (if provided)
    if (
      updateData.assignedTeam &&
      !mongoose.Types.ObjectId.isValid(updateData.assignedTeam)
    ) {
      return NextResponse.json(
        { error: "assignedTeam must be a valid ObjectId" },
        { status: 400 }
      );
    }

    // Update the project with only the provided fields
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to update only the provided fields
      { new: true }
    ).populate("assignedTeam"); // Populate the assignedTeam field

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Return the updated project
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(request: Request) {
  try {
    await connectDB();

    // Parse the request body
    const { id } = await request.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Delete the project
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
