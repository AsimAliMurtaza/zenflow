import Project from "@/models/Project";
import Sprint from "@/models/Sprint";
import { Sprint as SprintType, Task } from "@/types/types";

export async function updateProjectCompletion(projectId: string) {
  const project = await Project.findById(projectId).populate("sprints");
  if (!project || project.sprints.length === 0) return;

  const totalCompletion = project.sprints.reduce(
    (sum: number, sprint: SprintType) => sum + (sprint.completion || 0),
    0
  );

  const overall = Math.round(totalCompletion / project.sprints.length);
  project.completion = overall;

  // Optionally update status
  if (overall === 100) project.status = "Completed";
  else if (overall > 0) project.status = "In Progress";
  else project.status = "To Do";

  await project.save();
}

export async function updateSprintCompletion(sprintId: string) {
  const sprint = await Sprint.findById(sprintId).populate("tasks");
  if (!sprint) return;

  console.log("sprint", sprint);
  console.log("tasks", sprint.tasks);

  const total = sprint.tasks.length;
  const completed = sprint.tasks.filter(
    (task: Task) => task.status === "Completed"
  ).length;

  sprint.completion = total > 0 ? Math.round((completed / total) * 100) : 0;
  await sprint.save();
}
