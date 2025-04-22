import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Sprint from "@/models/Sprint";
import { generateGeminiContent } from "@/lib/gemini"; // Your Gemini API wrapper
import mongoose from "mongoose";
import { Task as TaskType } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const { prompt, projectId, sprintId } = await req.json();

    if (!prompt || !projectId || !sprintId) {
      return NextResponse.json(
        { message: "Missing prompt or projectId, or sprintId" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return NextResponse.json(
        { message: "Invalid projectId" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(sprintId)) {
      return NextResponse.json(
        { message: "Invalid sprintId" },
        { status: 400 }
      );
    }

    await dbConnect();

    const structuredPrompt = `Generate task for the following project based on this prompt: "${prompt}". Return a JSON of task object. The task object should have these fields: "title" (string, required), "description" (string, optional), "status" (string, one of "To Do", "In Progress", "Completed", default "To Do"), "priority" (string, one of "Low", "Medium", "High", default "Medium"), and "dueDate" (string in "YYYY-MM-DD" format, optional). Do not include any text outside of the JSON array, such as markdown code blocks or backticks.`;

    const geminiResponse = await generateGeminiContent(structuredPrompt);

    try {
      // Clean up the Gemini response to extract only the JSON
      const cleanedResponse = geminiResponse
        .replace(/```json\n?/g, "")
        .replace(/```/g, "");

      const generatedTasks = JSON.parse(cleanedResponse);

      if (!Array.isArray(generatedTasks)) {
        return NextResponse.json(
          { message: "Gemini response was not a JSON array of tasks." },
          { status: 500 }
        );
      }

      // Save the tasks and link them to the sprint
      const savedTasks = await Promise.all(
        generatedTasks.map(async (task: TaskType) => {
          const newTaskData: Partial<TaskType> = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: new Date(), // Convert dueDate string to Date object
            project: projectId,
            sprint: sprintId,
          };
          const newTask = new Task(newTaskData);
          await newTask.save();

          // Update the sprint's tasks array with the new task ID
          await Sprint.findByIdAndUpdate(sprintId, {
            $push: { tasks: newTask._id },
          });

          return newTask; // Return the task object
        })
      );

      return NextResponse.json({ tasks: savedTasks }, { status: 201 });
    } catch (jsonError) {
      console.error(
        "Error parsing Gemini response as JSON:",
        jsonError,
        geminiResponse
      );
      return NextResponse.json(
        {
          message:
            "Failed to parse Gemini response as valid tasks. Raw response: " +
            geminiResponse,
        }, //Include raw response in error
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
