import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper: recalculate sprint and project completion
async function recalculateCompletion(sprintId: string, projectId: string) {
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

// GET all tasks for a project
export async function GET(
  _request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: params.projectID },
      include: {
        sprint: true,
        assignees: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST — create a new task in a sprint
export async function POST(
  req: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      sprintId,
    } = await req.json();

    if (!sprintId) {
      return NextResponse.json(
        { error: "sprintId is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status ?? "To Do",
        priority: priority ?? "Medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        sprintId,
        projectId: params.projectID,
        // Create assignee records from array of emails
        assignees: assignedTo
          ? {
              create: (Array.isArray(assignedTo) ? assignedTo : [assignedTo]).map(
                (email: string) => ({ userEmail: email })
              ),
            }
          : undefined,
      },
      include: {
        sprint: true,
        assignees: true,
      },
    });

    await recalculateCompletion(sprintId, params.projectID);

    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    console.error("POST task error:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PUT — update a task
export async function PUT(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const { id, title, description, status, priority } = await request.json();

    const task = await prisma.task.update({
      where: { id },
      data: { title, description, status, priority },
      include: { sprint: true, assignees: true },
    });

    await recalculateCompletion(task.sprintId, params.projectID);

    return NextResponse.json(task);
  } catch (error) {
    console.error("PUT task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE — remove a task
export async function DELETE(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const { id } = await request.json();

    // Fetch first to know which sprint it belonged to
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });
    await recalculateCompletion(task.sprintId, params.projectID);

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
