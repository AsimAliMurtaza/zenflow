"use client";
import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

// Define task type with priority
type Task = { id: string; title: string; priority: "Low" | "Medium" | "High" };

// Define board structure
type TaskBoard = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

// Initial tasks with priority labels
const initialTasks: TaskBoard = {
  todo: [
    { id: "1", title: "Create UI Design", priority: "High" },
    { id: "4", title: "Write Documentation", priority: "Low" },
  ],
  inProgress: [{ id: "2", title: "Implement API", priority: "Medium" }],
  done: [{ id: "3", title: "Deploy App", priority: "High" }],
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<TaskBoard>(initialTasks);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceList = [...tasks[source.droppableId as keyof TaskBoard]];
    const destinationList = [
      ...tasks[destination.droppableId as keyof TaskBoard],
    ];
    const [movedTask] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedTask);

    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    }));
  };

  // Dynamic color mode values
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const columnBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBg = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.300", "gray.500");

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex gap={4} p={4} minH="auto" bg={bgColor}>
        {Object.keys(tasks).map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <VStack
                ref={provided.innerRef}
                {...provided.droppableProps}
                bg={columnBg}
                p={5}
                w="320px"
                minH="500px"
                borderRadius="xl"
                shadow="lg"
                align="stretch"
              >
                <Heading size="md" mb={4} textAlign="center">
                  {status === "todo"
                    ? "To Do"
                    : status === "inProgress"
                    ? "In Progress"
                    : "Done"}
                </Heading>
                {tasks[status as keyof TaskBoard].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        bg={cardBg}
                        p={4}
                        borderRadius="lg"
                        shadow="md"
                        w="full"
                        transition="all 0.2s"
                        _hover={{ bg: hoverBg, transform: "scale(1.02)" }}
                      >
                        <Text
                          fontSize="md"
                          fontWeight="semibold"
                          color={textColor}
                        >
                          {task.title}
                        </Text>
                        <Badge
                          mt={2}
                          colorScheme={
                            task.priority === "High"
                              ? "red"
                              : task.priority === "Medium"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {task.priority} Priority
                        </Badge>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        ))}
      </Flex>
    </DragDropContext>
  );
};

export default KanbanBoard;
