"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Badge,
  Input,
  Button,
  IconButton,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type Task = { id: string; title: string; priority: "Low" | "Medium" | "High" };

// Define board structure
type TaskBoard = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

// Initial tasks
const defaultTasks: TaskBoard = {
  todo: [
    { id: "1", title: "Create UI Design", priority: "High" },
    { id: "4", title: "Write Documentation", priority: "Low" },
  ],
  inProgress: [{ id: "2", title: "Implement API", priority: "Medium" }],
  done: [{ id: "3", title: "Deploy App", priority: "High" }],
};

interface BoardPageProps {
  projectID: string | string[];
}

const KanbanBoard = (projectID: BoardPageProps) => {
  const [tasks, setTasks] = useState<TaskBoard>(defaultTasks);
  const [newTask, setNewTask] = useState<{ [key in keyof TaskBoard]?: string }>({});
  const [editingTask, setEditingTask] = useState<{ id: string; status: keyof TaskBoard } | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Medium");

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = [...tasks[source.droppableId as keyof TaskBoard]];
    const destinationList = [...tasks[destination.droppableId as keyof TaskBoard]];
    const [movedTask] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedTask);

    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    }));
  };

  // Handle adding new tasks
  const addTask = (status: keyof TaskBoard) => {
    if (!newTask[status]) return;

    const newTaskObj: Task = {
      id: Date.now().toString(),
      title: newTask[status]!,
      priority: "Medium",
    };

    setTasks((prevTasks) => ({
      ...prevTasks,
      [status]: [...prevTasks[status], newTaskObj],
    }));

    setNewTask({ ...newTask, [status]: "" });
  };

  // Handle deleting tasks
  const deleteTask = (status: keyof TaskBoard, taskId: string) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [status]: prevTasks[status].filter((task) => task.id !== taskId),
    }));
  };

  // Handle editing tasks
  const startEditing = (status: keyof TaskBoard, task: Task) => {
    setEditingTask({ id: task.id, status });
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const saveEdit = () => {
    if (!editingTask) return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [editingTask.status]: prevTasks[editingTask.status].map((task) =>
        task.id === editingTask.id ? { ...task, title: editTitle, priority: editPriority } : task
      ),
    }));

    setEditingTask(null);
  };

  // Color themes
  const columnBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex gap={4} wrap="wrap">
        {Object.entries(tasks).map(([status, taskList]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <VStack
                ref={provided.innerRef}
                {...provided.droppableProps}
                bg={columnBg}
                p={4}
                w={{ base: "100%", md: "320px" }}
                minH="550px"
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
                shadow="lg"
                align="stretch"
                transition="all 0.3s"
              >
                <Heading
                  size="md"
                  mb={4}
                  textAlign="center"
                  color="blue.400"
                  textTransform="uppercase"
                >
                  {status === "todo"
                    ? "To Do"
                    : status === "inProgress"
                    ? "In Progress"
                    : "Done"}
                </Heading>

                {taskList.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        bg={cardBg}
                        p={4}
                        borderRadius="md"
                        shadow={snapshot.isDragging ? "2xl" : "md"}
                        w="full"
                        transition="all 0.2s"
                        _hover={{ bg: hoverBg }}
                        display="flex"
                        flexDirection="column"
                        gap={2}
                      >
                        {editingTask?.id === task.id ? (
                          <>
                            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            <Select value={editPriority} onChange={(e) => setEditPriority(e.target.value as Task["priority"])}>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </Select>
                            <Button size="sm" variant="outline" onClick={saveEdit}>
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <Text fontSize="md" fontWeight="bold" color={textColor}>
                              {task.title}
                            </Text>
                            <Badge colorScheme={task.priority === "High" ? "red" : task.priority === "Medium" ? "yellow" : "green"}>
                              {task.priority} Priority
                            </Badge>
                            <Flex gap={2} mt={2}>
                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                aria-label="Edit Task"
                                onClick={() => startEditing(status as keyof TaskBoard, task)}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                aria-label="Delete Task"
                                onClick={() => deleteTask(status as keyof TaskBoard, task.id)}
                              />
                            </Flex>
                          </>
                        )}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                <Input placeholder="Add a task..." size="sm" value={newTask[status as keyof TaskBoard] || ""} onChange={(e) => setNewTask({ ...newTask, [status as keyof TaskBoard]: e.target.value })} />
                <Button mt={2} w="20" size="sm" onClick={() => addTask(status as keyof TaskBoard)}>
                  Add Task
                </Button>
              </VStack>
            )}
          </Droppable>
        ))}
      </Flex>
    </DragDropContext>
  );
};

export default KanbanBoard;
