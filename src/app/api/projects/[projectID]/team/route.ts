import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";

export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    await connectDB(); // Ensure DB connection

    const team = await Team.find({ project: params.projectID });

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { message: "Failed to fetch team", error },
      { status: 500 }
    );
  }
}
