import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sprint from "@/models/Sprint";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Team from "@/models/Team";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function POST(
  req: Request,
  { params }: { params: { projectID: string; sprintID: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Session user ID is thisa:", session.user.id);

  const { projectID, sprintID } = params;
  const { title, description, assignedTo } = await req.json();

  if (!isValidObjectId(projectID) || !isValidObjectId(sprintID)) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  try {
    // Validate project and team
    const project = await Project.findById(projectID);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const team = await Team.findById(project.assignedTeam);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Ensure the assignedTo user is part of the team
    if (!team.members.includes(assignedTo)) {
      return NextResponse.json(
        { error: "Assigned member is not part of the team" },
        { status: 400 }
      );
    }

    // Create new task
    const newTask = new Task({
      title,
      description,
      assignedTo,
      createdBy: session.user.id,
    });

    await newTask.save();

    // Push to sprint
    const updatedSprint = await Sprint.findByIdAndUpdate(
      sprintID,
      { $push: { tasks: newTask._id } },
      { new: true }
    );

    if (!updatedSprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task created", task: newTask });
  } catch (error) {
    console.error("POST task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
