import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { teamId, email, invitedById } = await req.json();

    if (!teamId || !email || !invitedById) {
      return NextResponse.json(
        { error: "teamId, email, and invitedById are required" },
        { status: 400 }
      );
    }

    // Check if the user exists in our system
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: user.id } },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this team" },
        { status: 400 }
      );
    }

    // Check if already invited (upsert to avoid duplicate)
    const existingInvite = await prisma.invitation.findUnique({
      where: { teamId_email: { teamId, email } },
    });
    if (existingInvite) {
      return NextResponse.json(
        { error: "User already has a pending invitation" },
        { status: 400 }
      );
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        email,
        invitedById,
        status: "pending",
      },
    });

    // Send invite email
    const inviteLink = `${process.env.NEXT_PUBLIC_API_URL}/invite?token=${invitation.id}&email=${email}`;
    await sendEmail(
      email,
      "Team Invitation — ZenFlow",
      `You have been invited to join a team on ZenFlow. Accept here: ${inviteLink}`
    );

    return NextResponse.json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
