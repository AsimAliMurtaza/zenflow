import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();

    // Use UTC Dates directly
    const now = new Date();
    console.log("Server UTC Now:", now.toISOString());

    const startOfTodayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const endOfSevenDaysUTC = new Date(startOfTodayUTC);
    endOfSevenDaysUTC.setUTCDate(endOfSevenDaysUTC.getUTCDate() + 7);
    endOfSevenDaysUTC.setUTCHours(23, 59, 59, 999);

    // Total Projects
    const totalProjects = await Project.countDocuments();

    // Completed Projects
    const completedProjects = await Project.countDocuments({
      status: "Completed",
    });

    // In Progress Projects
    const inProgressProjects = await Project.countDocuments({
      status: "In Progress",
    });

    // Approaching Deadlines
    const approachingDeadlineProjects = await Project.find({
      dueDate: { $gte: startOfTodayUTC, $lte: endOfSevenDaysUTC },
      status: { $ne: "Completed" },
    }).select("name dueDate -_id");

    // Overdue Projects
    const overdueProjects = await Project.find({
      dueDate: { $lt: startOfTodayUTC },
      status: { $ne: "Completed" },
    }).select("name dueDate -_id");

    // Completion Percentages
    const projectCompletions = await Project.find({}).select(
      "name completion -_id"
    );
    const allProjects = await Project.find({});
    console.log("📌 All Project Dates:");
    allProjects.forEach((p) => {
      const dueDate =
        p.dueDate instanceof Date ? p.dueDate.toISOString() : String(p.dueDate);
      console.log(`• ${p.name}: ${dueDate} [${p.status}]`);
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
