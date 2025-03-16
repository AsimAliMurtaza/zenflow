// app/api/invitations/accept/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import Team from "@/models/Team";

export async function POST(req: Request) {
  await connectDB();

  const { token, email } = await req.json(); // Use email instead of userId

  try {
    // Find the invitation
    const invitation = await Invitation.findById(token);
    if (!invitation || invitation.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    // Add the user's email to the team
    const team = await Team.findByIdAndUpdate(
      invitation.teamId,
      { $push: { members: email } },
      { new: true }
    );

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Mark the invitation as accepted
    await Invitation.findByIdAndUpdate(token, { status: "accepted" });

    return NextResponse.json(
      { message: "Invitation accepted successfully", team },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}