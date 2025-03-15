// components/KanbanBoard.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Flex, Spinner, Center, useDisclosure } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./ui/TaskColumn";
import AddTaskModal from "./ui/AddTaskModal";
import { Task, TaskBoard } from "@/types/types";

const KanbanBoard = () => {
  const { projectID } = useParams();
  const [tasks, setTasks] = useState<TaskBoard>({
    "To Do": [],
    "In Progress": [],
    Completed: [],
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<Task["priority"]>("Medium");
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStatus, setSelectedStatus] =
    useState<keyof TaskBoard>("To Do");

  // Task creation form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState("");

  // Fetch tasks from MongoDB
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${projectID}/tasks`);
        const data = await response.json();
        const groupedTasks = data.reduce(
          (acc: TaskBoard, task: Task) => {
            if (!acc[task.status as keyof TaskBoard]) {
              acc[task.status as keyof TaskBoard] = [];
            }
            acc[task.status as keyof TaskBoard].push(task);
            return acc;
          },
          { "To Do": [], "In Progress": [], "Completed": [] } as TaskBoard
        );
        setTasks(groupedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectID]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = [...tasks[source.droppableId as keyof TaskBoard]];
    const destinationList = [
      ...tasks[destination.droppableId as keyof TaskBoard],
    ];
    const [movedTask] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedTask);

    // Update the task status in MongoDB
    try {
      await fetch(`/api/projects/${projectID}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movedTask._id,
          status: destination.droppableId,
        }),
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }

    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    }));
  };

  // Handle adding new tasks
  const addTask = async (status: keyof TaskBoard) => {
    if (!taskTitle) return;

    try {
      const response = await fetch(`/api/projects/${projectID}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status,
          priority: taskPriority,
          dueDate: taskDueDate || undefined,
          assignedTo: taskAssignedTo || undefined,
          project: projectID,
        }),
      });

      const createdTask = await response.json();
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: [...prevTasks[status], createdTask],
      }));
      onClose();
      resetTaskForm();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // Reset task creation form
  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("Medium");
    setTaskDueDate("");
    setTaskAssignedTo("");
  };

  // Handle deleting tasks
  const deleteTask = async (status: keyof TaskBoard, taskId: string) => {
    try {
      await fetch(`/api/projects/${projectID}/tasks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: prevTasks[status].filter((task) => task._id !== taskId),
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Handle editing tasks
  const startEditing = (
    taskId: string,
    title: string,
    priority: Task["priority"]
  ) => {
    setEditingTaskId(taskId);
    setEditTitle(title);
    setEditPriority(priority);
  };

  const saveEdit = async () => {
    if (!editingTaskId) return;

    try {
      const response = await fetch(`/api/projects/${projectID}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTaskId,
          title: editTitle,
          priority: editPriority,
        }),
      });

      const updatedTask = await response.json();
      setTasks((prevTasks) => ({
        ...prevTasks,
        [updatedTask.status]: prevTasks[
          updatedTask.status as keyof TaskBoard
        ].map((task) => (task._id === updatedTask._id ? updatedTask : task)),
      }));
      setEditingTaskId(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex gap={4} wrap="wrap">
          {Object.entries(tasks).map(([status, taskList]) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={taskList}
              onAddTask={() => {
                setSelectedStatus(status as keyof TaskBoard);
                onOpen();
              }}
              onEditTask={(taskId) =>
                startEditing(
                  taskId,
                  taskList.find((task) => task._id === taskId)?.title || "",
                  taskList.find((task) => task._id === taskId)?.priority ||
                    "Medium"
                )
              }
              onDeleteTask={(taskId) =>
                deleteTask(status as keyof TaskBoard, taskId)
              }
              editingTaskId={editingTaskId}
              editTitle={editTitle}
              editPriority={editPriority}
              onEditTitleChange={setEditTitle}
              onEditPriorityChange={setEditPriority}
              onSaveEdit={saveEdit}
            />
          ))}
        </Flex>
      </DragDropContext>

      <AddTaskModal
        isOpen={isOpen}
        onClose={onClose}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        taskPriority={taskPriority}
        taskDueDate={taskDueDate}
        taskAssignedTo={taskAssignedTo}
        onTaskTitleChange={setTaskTitle}
        onTaskDescriptionChange={setTaskDescription}
        onTaskPriorityChange={(value: string) =>
          setTaskPriority(value as Task["priority"])
        }
        onTaskDueDateChange={setTaskDueDate}
        onTaskAssignedToChange={setTaskAssignedTo}
        onAddTask={() => addTask(selectedStatus)}
      />
    </>
  );
};

export default KanbanBoard;
