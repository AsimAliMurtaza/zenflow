import { NextResponse } from "next/server";
import Task from "@/models/Task";
import Sprint from "@/models/Sprint";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { Task as TaskType } from "@/types/types";

// GET all tasks for a project
export async function GET(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await dbConnect();
  const tasks = await Task.find({ project: params.projectID })
    .populate("sprint")
    .populate("project"); // optional, since you already have projectID
  console.log("tasks", tasks);
  return NextResponse.json(tasks);
}

export async function POST(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await dbConnect();
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    sprint,
    createdBy,
    projectID,
  } = await request.json();

  const task = new Task({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    sprint,
    project: params.projectID,
    createdBy,
    projectID,
  });

  await task.save();

  if (sprint) {
    await Sprint.findByIdAndUpdate(sprint, { $push: { tasks: task._id } });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await dbConnect();

  console.log("params", params.projectID);

  const { id, title, description, status, priority } = await request.json();

  // 1. Update the task
  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, status, priority },
    { new: true }
  );

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // 2. Recalculate sprint completion
  const sprint = await Sprint.findById(task.sprint);
  if (sprint) {
    const sprintTasks = await Task.find({ _id: { $in: sprint.tasks } });
    const completedCount = sprintTasks.filter(
      (t:TaskType) => t.status === "Completed"
    ).length;
    const sprintCompletion = (completedCount / sprintTasks.length) * 100;

    sprint.completion = Math.round(sprintCompletion);
    await sprint.save();
  }

  // 3. Recalculate project completion
  const project = await Project.findById(task.project).populate("sprints");
  if (project) {
    let allTasks: TaskType[] = [];

    for (const sprint of project.sprints) {
      const sprintTasks = await Task.find({ _id: { $in: sprint.tasks } });
      allTasks = allTasks.concat(sprintTasks);
    }

    const completedCount = allTasks.filter(
      (t:TaskType) => t.status === "Completed"
    ).length;
    const projectCompletion = allTasks.length > 0 
      ? (completedCount / allTasks.length) * 100 
      : 0;

    project.completion = Math.round(projectCompletion);
    await project.save();
  }

  return NextResponse.json(task);
}


// DELETE a task
export async function DELETE(
  request: Request,
  { params }: { params: { projectID: string } }
) {
  await dbConnect();
  console.log("params", params);
  const { id } = await request.json();

  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted" });
}
