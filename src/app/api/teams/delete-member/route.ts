import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import { TeamMember } from "@/types/types";

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { teamId, memberId } = await request.json();

    // Find the team and remove the member
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Filter out the member to be deleted
    team.members = team.members.filter(
      (member: TeamMember) => member._id.toString() !== memberId
    );

    await team.save();

    return NextResponse.json(
      { message: "Member deleted successfully", team },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { message: "Failed to delete member" },
      { status: 500 }
    );
  }
}