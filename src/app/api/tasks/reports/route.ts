import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET() {
  try {
    await dbConnect();

    const taskReports = await Task.aggregate([
      {
        $group: {
          _id: "$project",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
          pendingTasks: {
            $sum: {
              $cond: [{ $ne: ["$status", "Completed"] }, 1, 0],
            },
          },
          highPriorityTasks: {
            $sum: {
              $cond: [{ $eq: ["$priority", "High"] }, 1, 0],
            },
          },
          mediumPriorityTasks: {
            $sum: {
              $cond: [{ $eq: ["$priority", "Medium"] }, 1, 0],
            },
          },
          lowPriorityTasks: {
            $sum: {
              $cond: [{ $eq: ["$priority", "Low"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "projects", // Name of the MongoDB collection, NOT the model name
          localField: "_id",
          foreignField: "_id",
          as: "projectInfo",
        },
      },
      {
        $unwind: "$projectInfo",
      },
      {
        $project: {
          _id: 0,
          projectId: "$_id",
          projectName: "$projectInfo.name",
          totalTasks: 1,
          completedTasks: 1,
          pendingTasks: 1,
          highPriorityTasks: 1,
          mediumPriorityTasks: 1,
          lowPriorityTasks: 1,
        },
      },
    ]);

    return NextResponse.json(taskReports);
  } catch (error) {
    console.error("Error fetching task reports:", error);
    return NextResponse.json(
      { message: "Failed to fetch task reports" },
      { status: 500 }
    );
  }
}
