import { prisma } from "@/lib/prisma";

export async function updateProjectCompletion(projectId: string) {
  const projectTasks = await prisma.task.findMany({ where: { projectId } });
  if (projectTasks.length === 0) return;

  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  const overall = Math.round((completed / projectTasks.length) * 100);

  await prisma.project.update({
    where: { id: projectId },
    data: {
      completion: overall,
      status:
        overall === 100 ? "Completed" : overall > 0 ? "In Progress" : "Not Started",
    },
  });
}

export async function updateSprintCompletion(sprintId: string) {
  const tasks = await prisma.task.findMany({ where: { sprintId } });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

  await prisma.sprint.update({
    where: { id: sprintId },
    data: { completion },
  });
}
