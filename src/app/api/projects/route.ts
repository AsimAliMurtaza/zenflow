import { NextResponse } from "next/server";
import Project from "@/models/Project";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Team from "@/models/Team";
import Task from "@/models/Task";
import Sprint from "@/models/Sprint";

// GET all projects
export async function GET(request: Request) {
  try {
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
  
    // Extract the Authorization header and get user ID
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "hello 1" }, { status: 401 });
    }

    const userId = authHeader.split(" ")[1];
    if (!userId) {
      return NextResponse.json({ error: "hello 2" }, { status: 401 });
    }

    const createdBy = userId

    console.log("Session user ID:", createdBy);

    // Ensure the Project model is registered
    if (!mongoose.models.Project) {
      mongoose.model("Project", Project.schema);
    }

    if (!mongoose.models.Team) {
      mongoose.model("Team", Team.schema);
    }

    // Fetch all projects and populate assignedTeam
    const projects = await Project.find({ createdBy }).populate(
      "assignedTeam",
      "name" // Populate only the name field of the assignedTeam
    ).populate("sprints").exec();
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

    const body = await request.json();

    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    if (body.assignedTeam && typeof body.assignedTeam !== "string") {
      return NextResponse.json(
        { error: "assignedTeam must be a Team object" },
        { status: 400 }
      );
    }

    // 1. Create the project
    const newProject = new Project({
      ...body,
      sprints: [], // initialize sprints array
    });
    await newProject.save();

    // 2. Create Sprint 0
    const Sprint = (await import("@/models/Sprint")).default;
    const sprintZero = await Sprint.create({
      name: "Sprint 0",
      startDate: new Date(),
      endDate: new Date(),
      tasks: [],
      project: newProject._id,
    });

    // 3. Add Sprint 0 to project
    newProject.sprints.push(sprintZero._id);
    await newProject.save();

    // 4. Populate the assignedTeam and return the result
    const populatedProject = await Project.findById(newProject._id).populate("assignedTeam");

    return NextResponse.json(populatedProject, { status: 201 });
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
