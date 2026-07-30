"use client";

import {
  VStack,
  HStack,
  Heading,
  Box,
  Badge,
  Button,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/types";
import { AddIcon } from "@chakra-ui/icons";

type TaskColumnProps = {
  status: string;
  tasks: Task[];
  onAddTask: () => void;
  onSelectTask: (task: Task) => void;
};

const TaskColumn = ({
  status,
  tasks,
  onAddTask,
  onSelectTask,
}: TaskColumnProps) => {
  const columnBg = useColorModeValue("gray.50", "gray.900");
  const columnBorder = useColorModeValue("gray.200", "gray.800");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const badgeBg = useColorModeValue("gray.200", "gray.700");

  const statusAccentMap: Record<string, string> = {
    "To Do": "purple.500",
    "In Progress": "blue.500",
    Completed: "green.500",
  };

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <VStack
          ref={provided.innerRef}
          {...provided.droppableProps}
          bg={columnBg}
          borderWidth="1px"
          borderColor={snapshot.isDraggingOver ? "blue.400" : columnBorder}
          p={3.5}
          w={{ base: "100%", md: "340px" }}
          minH="75vh"
          maxH="80vh"
          borderRadius="2xl"
          align="stretch"
          overflowY="auto"
          transition="all 0.2s ease"
          spacing={3}
          shadow="sm"
        >
          {/* Column Header */}
          <HStack justify="space-between" align="center" px={1} py={1}>
            <HStack spacing={2}>
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={statusAccentMap[status] || "gray.400"}
              />
              <Heading size="sm" fontWeight="bold" color={headingColor}>
                {status}
              </Heading>
              <Badge
                bg={badgeBg}
                color={headingColor}
                borderRadius="full"
                px={2.5}
                py={0.5}
                fontSize="xs"
                fontWeight="bold"
              >
                {tasks.length}
              </Badge>
            </HStack>

            <IconButton
              aria-label="Add Task to column"
              icon={<AddIcon boxSize={2.5} />}
              size="xs"
              variant="ghost"
              borderRadius="md"
              onClick={onAddTask}
            />
          </HStack>

          {/* Cards List */}
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  opacity={snapshot.isDragging ? 0.8 : 1}
                >
                  <TaskCard task={task} onSelectTask={onSelectTask} />
                </Box>
              )}
            </Draggable>
          ))}
          {provided.placeholder}

          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            leftIcon={<AddIcon boxSize={2.5} />}
            justifyContent="start"
            borderRadius="xl"
            onClick={onAddTask}
            mt={2}
            fontSize="xs"
          >
            Add Task
          </Button>
        </VStack>
      )}
    </Droppable>
  );
};

export default TaskColumn;