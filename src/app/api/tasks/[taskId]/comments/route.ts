import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/authHelpers";

// GET /api/tasks/[taskId]/comments
export async function GET(
  _req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: params.taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/tasks/[taskId]/comments
export async function POST(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId: params.taskId,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Notify task assignees
    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
      include: { assignees: true },
    });

    if (task && task.assignees.length > 0) {
      const commenter = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });
      const commenterName = commenter?.name || commenter?.email || "A teammate";

      for (const assignee of task.assignees) {
        const assigneeUser = await prisma.user.findUnique({
          where: { email: assignee.userEmail },
        });
        if (assigneeUser && assigneeUser.id !== userId) {
          await prisma.notification.create({
            data: {
              userId: assigneeUser.id,
              title: "New Comment on Task",
              message: `${commenterName} commented on "${task.title}": "${content.slice(0, 40)}${content.length > 40 ? "..." : ""}"`,
              type: "task",
              link: `/dashboard/projects/${task.projectId}`,
            },
          });
        }
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

// DELETE /api/tasks/[taskId]/comments?commentId=xxx
export async function DELETE(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json({ error: "commentId is required" }, { status: 400 });
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("DELETE comment error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
