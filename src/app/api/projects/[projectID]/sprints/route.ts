// app/api/projects/[projectID]/sprints/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sprint from "@/models/Sprint";
import Project from "@/models/Project";

export async function POST(
  req: NextRequest,
  { params }: { params: { projectID: string } }
) {
  try {
    await dbConnect();
    const projectID = params.projectID;
    const { name, startDate, endDate } = await req.json();

    const newSprint = await Sprint.create({
      name,
      startDate,
      endDate,
      project: projectID,
    });

    await Project.findByIdAndUpdate(projectID, {
      $push: { sprints: newSprint._id },
    });

    return NextResponse.json({ sprint: newSprint }, { status: 201 });
  } catch (error) {
    console.error("Error creating sprint:", error);
    return NextResponse.json(
      { error: "Failed to create sprint" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { projectID: string } }
) {
  await dbConnect();
  const projectID = params.projectID;
  const sprints = await Sprint.find({ project: projectID });
  return NextResponse.json(sprints);
}