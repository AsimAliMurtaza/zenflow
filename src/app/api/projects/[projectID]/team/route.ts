import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Project from "@/models/Project";

export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    await connectDB(); // Ensure DB connection

    const teamIds = await Project.find({ _id: params.projectID }).select("assignedTeam");
    console.log(teamIds)
    const team = await Team.find({ _id: { $in: teamIds[0].assignedTeam } });
    console.log(team)

    return NextResponse.json(team[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { message: "Failed to fetch team", error },
      { status: 500 }
    );
  }
}
