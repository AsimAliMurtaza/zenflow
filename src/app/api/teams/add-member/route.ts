// app/api/teams/add-member/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";

export async function POST(req: Request) {
  await connectDB();

  const { teamId, email } = await req.json(); // Use email instead of memberId

  try {
    // Find the team and add the member's email
    const team = await Team.findByIdAndUpdate(
      teamId,
      { $push: { members: email } },
      { new: true }
    );

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error adding member to team:", error);
    return NextResponse.json(
      { error: "Failed to add member to team" },
      { status: 500 }
    );
  }
}