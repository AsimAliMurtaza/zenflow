import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all sprints for a project
export async function GET(
  _req: NextRequest,
  { params }: { params: { projectID: string } }
) {
  try {
    const sprints = await prisma.sprint.findMany({
      where: { projectId: params.projectID },
      include: {
        tasks: {
          include: { assignees: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(sprints);
  } catch (error) {
    console.error("GET sprints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sprints" },
      { status: 500 }
    );
  }
}

// POST — create a new sprint in a project
export async function POST(
  req: NextRequest,
  { params }: { params: { projectID: string } }
) {
  try {
    const { name, startDate, endDate } = await req.json();

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "name, startDate and endDate are required" },
        { status: 400 }
      );
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        projectId: params.projectID,
      },
    });

    return NextResponse.json({ sprint }, { status: 201 });
  } catch (error) {
    console.error("POST sprint error:", error);
    return NextResponse.json(
      { error: "Failed to create sprint" },
      { status: 500 }
    );
  }
}