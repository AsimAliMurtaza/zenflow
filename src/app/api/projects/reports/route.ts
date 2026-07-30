import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const sevenDaysLater = new Date(now);
    sevenDaysLater.setUTCDate(sevenDaysLater.getUTCDate() + 7);
    const sevenDaysLaterStr = sevenDaysLater.toISOString().split("T")[0];

    // Count stats
    const totalProjects = await prisma.project.count();
    const completedProjects = await prisma.project.count({
      where: { status: "Completed" },
    });
    const inProgressProjects = await prisma.project.count({
      where: { status: "In Progress" },
    });

    // All non-completed projects with due dates
    const allProjects = await prisma.project.findMany({
      where: {
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

    // Project completion percentages
    const projectCompletions = await prisma.project.findMany({
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
