import { NextResponse } from "next/server";
import Task from "@/models/Task";
import Sprint from "@/models/Sprint";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { Task as TaskType } from "@/types/types";
import { calculateCompletion } from "@/lib/calculateCompletion";

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
  req: Request,
  { params }: { params: { projectID: string } }
) {
  const {
    title,
    description,
    status,
    priority,
    assignedTo,
    dueDate,
    sprintID,
    createdBy,
  } = await req.json();

  try {
    // Create the task
    const task = await Task.create({
      title,
      description,
      status,
      sprint: sprintID,
      assignedTo,
      priority,
      createdBy,
      dueDate,
      project: params.projectID, // Use the projectID from params
    });

    // Update the sprint to include this new task in the sprint's tasks array
    await Sprint.findByIdAndUpdate(sprintID, {
      $push: { tasks: task._id }, // Add the task to the sprint's tasks array
    });

    // Update sprint completion
    const sprintTasks = await Task.find({ sprint: sprintID });
    const sprintCompleted = sprintTasks.filter(
      (t) => t.status === "Completed"
    ).length;
    const sprintCompletion = calculateCompletion(
      sprintCompleted,
      sprintTasks.length
    );
    await Sprint.findByIdAndUpdate(sprintID, { completion: sprintCompletion });

    // Update project completion
    const sprint = await Sprint.findById(sprintID).populate("project");
    const project = sprint?.project;
    if (project) {
      const allSprints = await Sprint.find({ project: project._id });
      const allSprintIds = allSprints.map((s) => s._id);

      const allTasks = await Task.find({ sprint: { $in: allSprintIds } });
      const completedTasks = allTasks.filter(
        (t) => t.status === "Completed"
      ).length;

      const projectCompletion = calculateCompletion(
        completedTasks,
        allTasks.length
      );
      await Project.findByIdAndUpdate(project._id, {
        completion: projectCompletion,
        status: projectCompletion === 100 ? "Completed" : "In Progress",
      });
    }

    return Response.json({ task });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create task", { status: 500 });
  }
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
      (t: TaskType) => t.status === "Completed"
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
      (t: TaskType) => t.status === "Completed"
    ).length;
    const projectCompletion =
      allTasks.length > 0 ? (completedCount / allTasks.length) * 100 : 0;

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
