import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Invitation from "@/models/Invitation";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  await dbConnect();
  const { teamId, email, invitedBy } = await req.json();

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if already invited
  const existingInvite = await Invitation.findOne({ email, teamId });
  if (existingInvite) {
    return NextResponse.json(
      { error: "User already invited" },
      { status: 400 }
    );
  }

  // Create invitation
  const invitation = await Invitation.create({ email, teamId, invitedBy });

  // Send email with invitation link
  const inviteLink = `${process.env.NEXT_PUBLIC_API_URL}/invite?token=${invitation._id}&email=${email}`;

  await sendEmail(
    email,
    "Team Invitation",
    `You have been invited to join a team. Accept here: ${inviteLink}`
  );

  return NextResponse.json({ message: "Invitation sent successfully" });
}
