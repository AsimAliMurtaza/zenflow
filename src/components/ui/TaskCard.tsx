"use client";

import {
  Box,
  Text,
  Badge,
  Flex,
  HStack,
  Avatar,
  AvatarGroup,
  Icon,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { FiCalendar, FiCheckSquare } from "react-icons/fi";
import { Task } from "@/types/types";

type TaskCardProps = {
  task: Task;
  onSelectTask: (task: Task) => void;
};

const TaskCard = ({ task, onSelectTask }: TaskCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.750");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  const priorityColorMap = {
    High: "red",
    Medium: "orange",
    Low: "green",
  };

  const priorityStripeMap = {
    High: "red.500",
    Medium: "orange.400",
    Low: "green.400",
  };

  const formattedDueDate = task.dueDate
    ? typeof task.dueDate === "string"
      ? new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed";

  return (
    <Box
      bg={cardBg}
      p={4}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={cardBorder}
      borderLeftWidth="4px"
      borderLeftColor={priorityStripeMap[task.priority] || "gray.300"}
      shadow="sm"
      w="full"
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{
        shadow: "md",
        bg: hoverBg,
        transform: "translateY(-2px)",
      }}
      onClick={() => onSelectTask(task)}
    >
      <Flex direction="column" gap={3}>
        {/* Header Badges */}
        <Flex justify="space-between" align="center">
          <Badge
            colorScheme={priorityColorMap[task.priority]}
            variant="subtle"
            borderRadius="full"
            px={2.5}
            py={0.5}
            fontSize="xs"
            fontWeight="semibold"
          >
            {task.priority} Priority
          </Badge>
          {task.sprint && (
            <Text fontSize="xs" color="blue.400" fontWeight="medium">
              {task.sprint.name}
            </Text>
          )}
        </Flex>

        {/* Task Title */}
        <Text fontSize="sm" fontWeight="bold" color={textColor} lineHeight="snug" noOfLines={2}>
          {task.title}
        </Text>

        {/* Task Description Snippet if present */}
        {task.description && (
          <Text fontSize="xs" color={subTextColor} noOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Footer: Due Date, Subtasks, Comments & Assignee Avatars */}
        <Flex justify="space-between" align="center" mt={1}>
          <HStack spacing={3}>
            {formattedDueDate ? (
              <HStack spacing={1} color={isOverdue ? "red.500" : subTextColor}>
                <Icon as={FiCalendar} boxSize={3.5} />
                <Text fontSize="xs" fontWeight={isOverdue ? "bold" : "medium"}>
                  {formattedDueDate}
                </Text>
              </HStack>
            ) : (
              <HStack spacing={1} color={subTextColor}>
                <Icon as={FiCheckSquare} boxSize={3.5} />
                <Text fontSize="xs">Task</Text>
              </HStack>
            )}

            {/* Subtask progress count */}
            {task.subtasks && task.subtasks.length > 0 && (
              <HStack spacing={1} color={subTextColor}>
                <Icon as={FiCheckSquare} boxSize={3.5} color="blue.400" />
                <Text fontSize="xs" fontWeight="semibold">
                  {task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length}
                </Text>
              </HStack>
            )}

            {/* Comment count */}
            {task.comments && task.comments.length > 0 && (
              <HStack spacing={1} color={subTextColor}>
                <Text fontSize="xs">💬 {task.comments.length}</Text>
              </HStack>
            )}
          </HStack>

          {task.assignees && task.assignees.length > 0 && (
            <AvatarGroup size="xs" max={3} spacing={-1}>
              {task.assignees.map((assignee, idx) => (
                <Tooltip key={idx} label={assignee.userEmail}>
                  <Avatar name={assignee.userEmail} size="xs" />
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default TaskCard;