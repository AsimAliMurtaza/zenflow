import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();

    // Get current date in YYYY-MM-DD format (UTC)
    const now = new Date();
    const todayUTC = now.toISOString().split("T")[0]; // Format: "2025-04-18"

    // Calculate 7 days from now in YYYY-MM-DD format
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setUTCDate(sevenDaysLater.getUTCDate() + 7);
    const sevenDaysLaterUTC = sevenDaysLater.toISOString().split("T")[0];

    // Total Projects
    const totalProjects = await Project.countDocuments();

    // Completed Projects
    const completedProjects = await Project.find({
      status: { $eq: "Completed" },
    }).countDocuments();

    // In Progress Projects
    const inProgressProjects = await Project.countDocuments({
      status: "In Progress",
    });

    // Get all non-completed projects with due dates
    const allProjects = await Project.find({
      status: { $ne: "Completed" },
      dueDate: { $ne: "" }, // Exclude empty/null due dates
    }).select("name dueDate -_id");

    // Categorize projects
    const overdueProjects = [];
    const approachingDeadlineProjects = [];

    for (const project of allProjects) {
      const dueDate = project.dueDate;

      if (!dueDate) continue;

      if (dueDate < todayUTC) {
        // Overdue (due date is before today)
        overdueProjects.push(project);
      } else if (dueDate <= sevenDaysLaterUTC) {
        // Approaching deadline (due date is today or within 7 days)
        approachingDeadlineProjects.push(project);
      }
    }

    // Completion Percentages
    const projectCompletions = await Project.find({}).select(
      "name completion -_id"
    );

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
