import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { Sprint } from "@/types/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectID: string; sprintID: string } }
) {
  await dbConnect();
  const { projectID, sprintID } = params;
  const updates = await req.json();

  const project = await Project.findById(projectID).populate("sprints");
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const sprint = project.sprints.find(
    (s: Sprint) => s._id.toString() === sprintID
  );
  if (!sprint)
    return NextResponse.json({ error: "Sprint not found" }, { status: 404 });

  // Update fields
  sprint.name = updates.name;
  sprint.startDate = updates.startDate;
  sprint.endDate = updates.endDate;

  await sprint.save(); // Save the Sprint document directly

  return NextResponse.json(sprint);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectID: string; sprintID: string } }
) {
  await dbConnect();
  const { projectID, sprintID } = params;

  const project = await Project.findById(projectID);
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  project.sprints = project.sprints.filter(
    (s: Sprint) => s._id.toString() !== sprintID
  );
  await project.save();

  return NextResponse.json({ message: "Sprint deleted" });
}
