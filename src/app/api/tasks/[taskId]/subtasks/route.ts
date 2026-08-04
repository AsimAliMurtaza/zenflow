import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/[taskId]/subtasks
export async function GET(
  _req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const subtasks = await prisma.subtask.findMany({
      where: { taskId: params.taskId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(subtasks);
  } catch (error) {
    console.error("GET subtasks error:", error);
    return NextResponse.json({ error: "Failed to fetch subtasks" }, { status: 500 });
  }
}

// POST /api/tasks/[taskId]/subtasks
export async function POST(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { title } = await req.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const subtask = await prisma.subtask.create({
      data: {
        title: title.trim(),
        taskId: params.taskId,
      },
    });

    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error("POST subtask error:", error);
    return NextResponse.json({ error: "Failed to create subtask" }, { status: 500 });
  }
}

// PATCH /api/tasks/[taskId]/subtasks
export async function PATCH(req: Request) {
  try {
    const { subtaskId, isCompleted, title } = await req.json();
    if (!subtaskId) {
      return NextResponse.json({ error: "subtaskId is required" }, { status: 400 });
    }

    const updated = await prisma.subtask.update({
      where: { id: subtaskId },
      data: {
        ...(typeof isCompleted === "boolean" ? { isCompleted } : {}),
        ...(title ? { title: title.trim() } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH subtask error:", error);
    return NextResponse.json({ error: "Failed to update subtask" }, { status: 500 });
  }
}

// DELETE /api/tasks/[taskId]/subtasks?subtaskId=xxx
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subtaskId = searchParams.get("subtaskId");
    if (!subtaskId) {
      return NextResponse.json({ error: "subtaskId is required" }, { status: 400 });
    }

    await prisma.subtask.delete({ where: { id: subtaskId } });
    return NextResponse.json({ message: "Subtask deleted" });
  } catch (error) {
    console.error("DELETE subtask error:", error);
    return NextResponse.json({ error: "Failed to delete subtask" }, { status: 500 });
  }
}
