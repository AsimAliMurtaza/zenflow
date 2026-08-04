import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectID: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";

    const project = await prisma.project.findUnique({
      where: { id: params.projectID },
      include: {
        assignedTeam: {
          include: {
            members: {
              include: {
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
        sprints: true,
        tasks: {
          include: {
            assignees: true,
            sprint: { select: { name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (format === "csv") {
      // Generate CSV content
      const headers = [
        "Task ID",
        "Title",
        "Description",
        "Status",
        "Priority",
        "Sprint",
        "Due Date",
        "Assignees",
        "Created At",
      ];

      const rows = project.tasks.map((task) => [
        `"${task.id}"`,
        `"${(task.title || "").replace(/"/g, '""')}"`,
        `"${(task.description || "").replace(/"/g, '""')}"`,
        `"${task.status}"`,
        `"${task.priority}"`,
        `"${task.sprint?.name || "Backlog"}"`,
        `"${task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""}"`,
        `"${task.assignees.map((a) => a.userEmail).join(", ")}"`,
        `"${new Date(task.createdAt).toISOString().split("T")[0]}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_export.csv"`,
        },
      });
    }

    // JSON format
    return new NextResponse(JSON.stringify(project, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_export.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
