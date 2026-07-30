import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, getUserTeamIds } from "@/lib/authHelpers";

// GET teams accessible by the authenticated user
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamIds = await getUserTeamIds(userId);

    // Isolated Teams query: Only teams the user is a member of
    const teams = await prisma.team.findMany({
      where: {
        id: { in: teamIds },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        projects: {
          select: { id: true, name: true, status: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST — create a new team (auto-adds creator as owner)
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    const { name, creatorId } = await request.json();
    const activeUserId = creatorId || userId;

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: { name },
      });

      if (activeUserId) {
        await tx.teamMember.create({
          data: {
            teamId: newTeam.id,
            userId: activeUserId,
            role: "owner",
          },
        });
      }

      return tx.team.findUnique({
        where: { id: newTeam.id },
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
          projects: { select: { id: true, name: true, status: true } },
        },
      });
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}

// DELETE — remove a team (members cascade via schema)
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ message: "Team deleted" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
