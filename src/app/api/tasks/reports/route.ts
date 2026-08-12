import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, getUserTeamIds } from "@/lib/authHelpers";

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamIds = await getUserTeamIds(userId);

    // Isolated Projects query for Task Reports
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdById: userId },
          { assignedTeamId: { in: teamIds } },
        ],
      },
      select: {
        id: true,
        name: true,
        tasks: {
          select: {
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
    });

    const now = new Date();

    const taskReports = projects
      .filter((p) => p.tasks.length > 0)
      .map((project) => {
        const tasks = project.tasks;

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (t) => t.status === "Completed"
        ).length;
        const pendingTasks = tasks.filter(
          (t) => t.status !== "Completed"
        ).length;
        const highPriorityTasks = tasks.filter(
          (t) => t.priority === "High"
        ).length;
        const mediumPriorityTasks = tasks.filter(
          (t) => t.priority === "Medium"
        ).length;
        const lowPriorityTasks = tasks.filter(
          (t) => t.priority === "Low"
        ).length;
        const overdueTasks = tasks.filter(
          (t) =>
            t.dueDate &&
            new Date(t.dueDate) < now &&
            t.status !== "Completed"
        ).length;

        return {
          projectId: project.id,
          projectName: project.name,
          totalTasks,
          completedTasks,
          pendingTasks,
          highPriorityTasks,
          mediumPriorityTasks,
          lowPriorityTasks,
          overdueTasks,
        };
      });

    return NextResponse.json(taskReports);
  } catch (error) {
    console.error("Error fetching task reports:", error);
    return NextResponse.json(
      { message: "Failed to fetch task reports" },
      { status: 500 }
    );
  }
}
