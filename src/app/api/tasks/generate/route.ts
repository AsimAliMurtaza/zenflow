import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGeminiContent } from "@/lib/gemini";

interface GeneratedTask {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, projectId, sprintId } = await req.json();

    if (!prompt || !projectId || !sprintId) {
      return NextResponse.json(
        { message: "Missing prompt, projectId, or sprintId" },
        { status: 400 }
      );
    }

    // Verify sprint and project exist
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return NextResponse.json({ message: "Sprint not found" }, { status: 404 });
    }

    const structuredPrompt = `Generate task for the following project based on this prompt: "${prompt}". Return a JSON array of task objects. Each task object should have these fields: "title" (string, required), "description" (string, optional), "status" (string, one of "To Do", "In Progress", "Completed", default "To Do"), "priority" (string, one of "Low", "Medium", "High", default "Medium"), and "dueDate" (string in "YYYY-MM-DD" format, optional). Do not include any text outside of the JSON array, such as markdown code blocks or backticks.`;

    const geminiResponse = await generateGeminiContent(structuredPrompt);

    try {
      const cleanedResponse = geminiResponse
        .replace(/```json\n?/g, "")
        .replace(/```/g, "")
        .trim();

      const generatedTasks: GeneratedTask[] = JSON.parse(cleanedResponse);

      if (!Array.isArray(generatedTasks)) {
        return NextResponse.json(
          { message: "Gemini response was not a JSON array of tasks." },
          { status: 500 }
        );
      }

      // Save all tasks linked to the sprint in a transaction
      const savedTasks = await prisma.$transaction(
        generatedTasks.map((task) =>
          prisma.task.create({
            data: {
              title: task.title,
              description: task.description ?? null,
              status: task.status ?? "To Do",
              priority: task.priority ?? "Medium",
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
              projectId,
              sprintId,
            },
          })
        )
      );

      // Recalculate sprint/project completion
      const sprintTasks = await prisma.task.findMany({ where: { sprintId } });
      const sprintCompleted = sprintTasks.filter(
        (t) => t.status === "Completed"
      ).length;
      const sprintCompletion =
        sprintTasks.length > 0
          ? Math.round((sprintCompleted / sprintTasks.length) * 100)
          : 0;
      await prisma.sprint.update({
        where: { id: sprintId },
        data: { completion: sprintCompletion },
      });

      const projectTasks = await prisma.task.findMany({
        where: { projectId },
      });
      const projectCompleted = projectTasks.filter(
        (t) => t.status === "Completed"
      ).length;
      const projectCompletion =
        projectTasks.length > 0
          ? Math.round((projectCompleted / projectTasks.length) * 100)
          : 0;
      await prisma.project.update({
        where: { id: projectId },
        data: {
          completion: projectCompletion,
          status:
            projectCompletion === 100
              ? "Completed"
              : projectCompletion > 0
              ? "In Progress"
              : "Not Started",
        },
      });

      return NextResponse.json({ tasks: savedTasks }, { status: 201 });
    } catch (jsonError) {
      console.error("Error parsing Gemini response:", jsonError, geminiResponse);
      return NextResponse.json(
        {
          message:
            "Failed to parse Gemini response as valid tasks. Raw: " +
            geminiResponse,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Task generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate tasks" },
      { status: 500 }
    );
  }
}
