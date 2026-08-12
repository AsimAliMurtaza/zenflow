import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET the team assigned to a project
export async function GET(
  _request: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.projectID },
      include: {
        assignedTeam: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project.assignedTeam ?? null, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { message: "Failed to fetch team", error },
      { status: 500 }
    );
  }
}
