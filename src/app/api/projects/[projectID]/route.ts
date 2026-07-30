import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET project details with full sprint+task tree
export async function GET(
  _request: Request,
  { params }: { params: { projectID: string } }
) {
  const { projectID } = params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectID },
      include: {
        assignedTeam: { select: { id: true, name: true } },
        sprints: {
          include: {
            tasks: {
              include: { assignees: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("GET project error:", err);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// POST — not used at this route level
export async function POST() {
  return NextResponse.json(
    { error: "Use Sprint-specific route to add tasks" },
    { status: 400 }
  );
}

// PUT — update project fields
export async function PUT(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  const { projectID } = params;

  try {
    const updateData = await request.json();
    const { id: _id, createdById: _c, createdAt: _ca, ...safeData } = updateData;
    void _id; void _c; void _ca;

    const updatedProject = await prisma.project.update({
      where: { id: projectID },
      data: safeData,
      include: {
        assignedTeam: { select: { id: true, name: true } },
        sprints: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE — remove project
export async function DELETE(
  _request: Request,
  { params }: { params: { projectID: string } }
) {
  const { projectID } = params;

  try {
    await prisma.project.delete({ where: { id: projectID } });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
