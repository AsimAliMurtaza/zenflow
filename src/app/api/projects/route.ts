import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper: recalculate sprint and project completion after task changes
async function recalculateCompletion(sprintId: string, projectId: string) {
  // Sprint completion
  const sprintTasks = await prisma.task.findMany({ where: { sprintId } });
  const sprintCompleted = sprintTasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const sprintCompletion =
    sprintTasks.length > 0
      ? Math.round((sprintCompleted / sprintTasks.length) * 100)
      : 0;
  await prisma.sprint.update({
    where: { id: sprintId },
    data: { completion: sprintCompletion },
  });

  // Project completion (across all sprints)
  const projectTasks = await prisma.task.findMany({ where: { projectId } });
  const projectCompleted = projectTasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const projectCompletion =
    projectTasks.length > 0
      ? Math.round((projectCompleted / projectTasks.length) * 100)
      : 0;
  await prisma.project.update({
    where: { id: projectId },
    data: {
      completion: projectCompletion,
      status:
        projectCompletion === 100
          ? "Completed"
          : projectCompletion > 0
          ? "In Progress"
          : "Not Started",
    },
  });
}

// GET all projects for the authenticated user
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authHeader.split(" ")[1];
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { createdById: userId },
      include: {
        assignedTeam: { select: { id: true, name: true } },
        sprints: {
          include: {
            tasks: {
              include: { assignees: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST a new project (auto-creates Sprint 0)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, assignedTeamId, dueDate, createdById } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    if (!createdById) {
      return NextResponse.json(
        { error: "createdById is required" },
        { status: 400 }
      );
    }

    // Create project + Sprint 0 in a transaction
    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          description,
          assignedTeamId: assignedTeamId ?? null,
          dueDate: dueDate ?? null,
          createdById,
        },
      });

      await tx.sprint.create({
        data: {
          name: "Sprint 0",
          startDate: new Date(),
          endDate: new Date(),
          projectId: newProject.id,
        },
      });

      return tx.project.findUnique({
        where: { id: newProject.id },
        include: {
          assignedTeam: { select: { id: true, name: true } },
          sprints: true,
        },
      });
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT update a project (via ?id= query param)
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    // Strip non-updatable fields
    const { id: _id, createdById: _c, createdAt: _ca, ...safeData } = updateData;
    void _id; void _c; void _ca;

    const project = await prisma.project.update({
      where: { id },
      data: safeData,
      include: {
        assignedTeam: { select: { id: true, name: true } },
        sprints: true,
      },
    });

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
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export { recalculateCompletion };
