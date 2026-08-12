import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// POST — create a task in a specific sprint
// This route exists as an alternative to the projectID-scoped route
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, sprintId, title, description, assignedTo } =
    await req.json();

  if (!projectId || !sprintId || !title) {
    return NextResponse.json(
      { error: "projectId, sprintId, and title are required" },
      { status: 400 }
    );
  }

  try {
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        projectId,
        sprintId,
        assignees: assignedTo
          ? {
              create: (Array.isArray(assignedTo)
                ? assignedTo
                : [assignedTo]
              ).map((email: string) => ({ userEmail: email })),
            }
          : undefined,
      },
      include: { assignees: true, sprint: true },
    });

    return NextResponse.json({ message: "Task created", task });
  } catch (error) {
    console.error("POST task error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
