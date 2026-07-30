import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT — update a sprint's name/dates
export async function PUT(
  req: NextRequest,
  { params }: { params: { projectID: string; sprintID: string } }
) {
  const { sprintID } = params;

  try {
    const { name, startDate, endDate } = await req.json();

    const sprint = await prisma.sprint.update({
      where: { id: sprintID },
      data: {
        name,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: { tasks: true },
    });

    return NextResponse.json(sprint);
  } catch (error) {
    console.error("PUT sprint error:", error);
    return NextResponse.json(
      { error: "Failed to update sprint" },
      { status: 500 }
    );
  }
}

// DELETE — remove a sprint and its tasks (cascade via schema)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { projectID: string; sprintID: string } }
) {
  const { sprintID } = params;

  try {
    await prisma.sprint.delete({ where: { id: sprintID } });
    return NextResponse.json({ message: "Sprint deleted" });
  } catch (error) {
    console.error("DELETE sprint error:", error);
    return NextResponse.json(
      { error: "Failed to delete sprint" },
      { status: 500 }
    );
  }
}
