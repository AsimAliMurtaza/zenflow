import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE — remove a member from a team
export async function DELETE(request: Request) {
  try {
    const { teamId, memberId } = await request.json();

    if (!teamId || !memberId) {
      return NextResponse.json(
        { message: "teamId and memberId are required" },
        { status: 400 }
      );
    }

    // memberId here is the TeamMember.id
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.teamId !== teamId) {
      return NextResponse.json(
        { message: "Member not found in this team" },
        { status: 404 }
      );
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    const updatedTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Member deleted successfully", team: updatedTeam },
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