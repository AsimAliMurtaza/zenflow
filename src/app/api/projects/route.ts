import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, getUserTeamIds } from "@/lib/authHelpers";

// GET all projects accessible by the authenticated user
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamIds = await getUserTeamIds(userId);

    // Isolated Projects query: Created by user OR assigned to a team user is a member of
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdById: userId },
          { assignedTeamId: { in: teamIds } },
        ],
      },
      include: {
        assignedTeam: { select: { id: true, name: true } },
        sprints: {
          include: {
            tasks: {
              include: { assignees: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST a new project (auto-creates Sprint 0)
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    const body = await request.json();
    const { name, description, assignedTeamId, dueDate } = body;
    const createdById = body.createdById || userId;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    if (!createdById) {
      return NextResponse.json(
        { error: "createdById is required" },
        { status: 400 }
      );
    }

    // Create project + Sprint 0 in a transaction
    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          description,
          assignedTeamId: assignedTeamId ?? null,
          dueDate: dueDate ?? null,
          createdById,
        },
      });

      await tx.sprint.create({
        data: {
          name: "Sprint 0",
          startDate: new Date(),
          endDate: new Date(),
          projectId: newProject.id,
        },
      });

      return tx.project.findUnique({
        where: { id: newProject.id },
        include: {
          assignedTeam: { select: { id: true, name: true } },
          sprints: true,
        },
      });
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT update a project (via ?id= query param)
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    const { id: _id, createdById: _c, createdAt: _ca, ...safeData } = updateData;
    void _id; void _c; void _ca;

    const project = await prisma.project.update({
      where: { id },
      data: safeData,
      include: {
        assignedTeam: { select: { id: true, name: true } },
        sprints: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
