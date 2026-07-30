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

    // Isolated Project Filter
    const projectWhere = {
      OR: [
        { createdById: userId },
        { assignedTeamId: { in: teamIds } },
      ],
    };

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const sevenDaysLater = new Date(now);
    sevenDaysLater.setUTCDate(sevenDaysLater.getUTCDate() + 7);
    const sevenDaysLaterStr = sevenDaysLater.toISOString().split("T")[0];

    // Count stats for user's accessible projects
    const totalProjects = await prisma.project.count({ where: projectWhere });
    const completedProjects = await prisma.project.count({
      where: { ...projectWhere, status: "Completed" },
    });
    const inProgressProjects = await prisma.project.count({
      where: { ...projectWhere, status: "In Progress" },
    });

    // All non-completed accessible projects with due dates
    const allProjects = await prisma.project.findMany({
      where: {
        ...projectWhere,
        status: { not: "Completed" },
        dueDate: { not: null },
      },
      select: { name: true, dueDate: true },
    });

    const overdueProjects = [];
    const approachingDeadlineProjects = [];

    for (const project of allProjects) {
      const dueDate = project.dueDate;
      if (!dueDate) continue;

      if (dueDate < todayStr) {
        overdueProjects.push(project);
      } else if (dueDate <= sevenDaysLaterStr) {
        approachingDeadlineProjects.push(project);
      }
    }

    // Project completion percentages for user's projects
    const projectCompletions = await prisma.project.findMany({
      where: projectWhere,
      select: { name: true, completion: true },
    });

    return NextResponse.json({
      totalProjects,
      completedProjects,
      inProgressProjects,
      approachingDeadlineProjects,
      overdueProjects,
      projectCompletions,
    });
  } catch (error) {
    console.error("Error fetching project reports:", error);
    return NextResponse.json(
      { message: "Failed to fetch project reports" },
      { status: 500 }
    );
  }
}
