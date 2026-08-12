import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGeminiContent } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        sprints: {
          include: {
            tasks: {
              include: { assignees: true },
            },
          },
        },
        tasks: {
          include: { assignees: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === "Completed").length;
    const inProgressTasks = project.tasks.filter((t) => t.status === "In Progress").length;
    const toDoTasks = project.tasks.filter((t) => t.status === "To Do").length;
    const highPriorityTasks = project.tasks.filter((t) => t.priority === "High").length;

    const now = new Date();
    const overdueTasks = project.tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "Completed"
    );

    const projectSummary = {
      projectName: project.name,
      status: project.status,
      completionPercentage: project.completion,
      dueDate: project.dueDate,
      totalTasks,
      completedTasks,
      inProgressTasks,
      toDoTasks,
      highPriorityTasks,
      overdueCount: overdueTasks.length,
      overdueTaskTitles: overdueTasks.map((t) => t.title),
      sprintCount: project.sprints.length,
    };

    const prompt = `Analyze this project's current status and health data for ZenFlow project management:
\`\`\`json
${JSON.stringify(projectSummary, null, 2)}
\`\`\`

Provide an Executive Project Health & Sprint Risk Analysis with the following markdown format:
### 📊 Project Health Score: [Score e.g. 85/100] (Status: Healthy / Needs Attention / At Risk)

#### ⚠️ Key Risk Factors & Bottlenecks
- Bullet point risks (overdue tasks, velocity, unassigned high priority items)

#### 🚀 Recommended Action Steps
- Actionable steps for sprint completion and team workload balance

#### 💡 Executive Summary
- Brief 2-sentence summary of overall project progress.`;

    const aiReport = await generateGeminiContent(prompt);

    return NextResponse.json({
      healthReport: aiReport,
      metrics: projectSummary,
    });
  } catch (error) {
    console.error("AI Health Check error:", error);
    return NextResponse.json(
      { error: "Failed to generate health check report" },
      { status: 500 }
    );
  }
}
