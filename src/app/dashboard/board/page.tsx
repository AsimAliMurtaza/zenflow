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
  DroppableProvided,
} from "react-beautiful-dnd";

// Fix: Strict Mode Wrapper for Droppable
const StrictModeDroppable = ({
  droppableId,
  children,
}: {
  droppableId: string;
  children: any;
}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children(provided, snapshot)}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

// Define task type
type Task = { id: string; title: string; priority: "Low" | "Medium" | "High" };

// Define board structure
type TaskBoard = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

// Initial tasks
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

  // Color themes
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const columnBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex p={4} gap={4} bg={bgColor} wrap="wrap">
        {Object.entries(tasks).map(([status, taskList]) => (
          <StrictModeDroppable key={status} droppableId={status}>
            {(provided: DroppableProvided) => (
              <VStack
                ref={provided.innerRef}
                {...provided.droppableProps}
                bg={columnBg}
                p={4}
                w={{ base: "100%", md: "300px" }}
                minH="550px"
                borderRadius="xl"
                shadow="xl"
                align="stretch"
                transition="all 0.3s"
              >
                <Heading
                  size="md"
                  mb={4}
                  textAlign="center"
                  color="blue.200"
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
                        p={3}
                        borderRadius="md"
                        shadow={snapshot.isDragging ? "2xl" : "md"}
                        w="full"
                        transition="all 0.2s"
                        transform={
                          snapshot.isDragging ? "scale(1.05)" : "scale(1)"
                        }
                        _hover={{ bg: hoverBg }}
                      >
                        <Text fontSize="md" fontWeight="bold" color={textColor}>
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
              </VStack>
            )}
          </StrictModeDroppable>
        ))}
      </Flex>
    </DragDropContext>
  );
};

export default KanbanBoard;
