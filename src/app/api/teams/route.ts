import { NextResponse } from "next/server";
import Team from "@/models/Team";
import Member from "@/models/Member";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();

  try {
    // Fetch teams (no need to populate members)
    const teams = await Team.find();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST a new team
export async function POST(request: Request) {
  await connectDB();
  const { name } = await request.json();

  // Create a new team
  const team = new Team({ name });
  await team.save();

  return NextResponse.json(team);
}

// PUT add members to a team
export async function PUT(request: Request) {
  await connectDB();
  const { teamId, name, role } = await request.json();

  // Create a new member
  const member = new Member({ name, role });
  await member.save();

  // Add the member to the team
  const team = await Team.findByIdAndUpdate(
    teamId,
    { $push: { members: member._id } },
    { new: true }
  ).populate("members");

  return NextResponse.json(team);
}

// DELETE a team
export async function DELETE(request: Request) {
  await connectDB();
  const { id } = await request.json();

  // Delete the team and its members
  const team = await Team.findByIdAndDelete(id);
  await Member.deleteMany({ _id: { $in: team.members } });

  return NextResponse.json({ message: "Team deleted" });
}
