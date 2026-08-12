import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — add a user to a team by email, and mark invitation as accepted
export async function POST(req: Request) {
  try {
    const { teamId, email } = await req.json();

    if (!teamId || !email) {
      return NextResponse.json(
        { error: "teamId and email are required" },
        { status: 400 }
      );
    }

    // Look up the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already a member
    const existing = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: user.id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User is already a member" },
        { status: 400 }
      );
    }

    // Add to team
    await prisma.teamMember.create({
      data: { teamId, userId: user.id, role: "member" },
    });

    // Mark invitation as accepted if one exists
    const invitation = await prisma.invitation.findUnique({
      where: { teamId_email: { teamId, email } },
    });
    if (invitation) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "accepted" },
      });
    }

    // Return updated team
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error adding member to team:", error);
    return NextResponse.json(
      { error: "Failed to add member to team" },
      { status: 500 }
    );
  }
}