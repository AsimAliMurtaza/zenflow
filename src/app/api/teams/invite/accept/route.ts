import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — accept a team invitation using the token (invitation.id) and email
export async function POST(req: Request) {
  const { token, email } = await req.json();

  try {
    // Find the invitation by id
    const invitation = await prisma.invitation.findUnique({
      where: { id: token },
    });

    if (!invitation || invitation.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    if (invitation.email !== email) {
      return NextResponse.json(
        { error: "Email does not match invitation" },
        { status: 400 }
      );
    }

    // Look up user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add user as team member (upsert to avoid duplicates)
    await prisma.teamMember.upsert({
      where: {
        teamId_userId: { teamId: invitation.teamId, userId: user.id },
      },
      create: { teamId: invitation.teamId, userId: user.id, role: "member" },
      update: {},
    });

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: token },
      data: { status: "accepted" },
    });

    const team = await prisma.team.findUnique({
      where: { id: invitation.teamId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

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