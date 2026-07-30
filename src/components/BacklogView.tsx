"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Progress,
  IconButton,
  Card,
  CardBody,
  Divider,
  Tag,
  Flex,
  Avatar,
  AvatarGroup,
  useColorModeValue,
  useToast,
  Select,
  Icon,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { FiCalendar, FiPlay, FiCheckCircle } from "react-icons/fi";
import { Project, Sprint, Task } from "@/types/types";

interface BacklogViewProps {
  project: Project;
  sprints: Sprint[];
  tasks: Task[];
  onRefresh: () => void;
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: (sprintId?: string) => void;
  onOpenCreateSprint: () => void;
}

export const BacklogView = ({
  project,
  sprints,
  tasks,
  onRefresh,
  onSelectTask,
  onOpenCreateTask,
  onOpenCreateSprint,
}: BacklogViewProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const backlogBg = useColorModeValue("gray.50", "gray.900");

  const toast = useToast();

  // Tasks with no sprint or sprintId
  const backlogTasks = tasks.filter(
    (t) => !t.sprintId || !sprints.some((s) => s.id === t.sprintId)
  );

  const handleMoveTaskSprint = async (taskId: string, newSprintId: string) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, sprintId: newSprintId }),
      });
      if (!res.ok) throw new Error("Failed to update sprint");
      toast({ title: "Task moved", status: "success", duration: 2000 });
      onRefresh();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to move task", status: "error", duration: 3000 });
    }
  };

  const priorityColorMap = {
    High: "red",
    Medium: "orange",
    Low: "green",
  };

  return (
    <VStack align="stretch" spacing={6} p={2}>
      {/* Header Actions */}
      <HStack justify="space-between" align="center">
        <Box>
          <Heading size="lg" fontWeight="bold">
            Backlog & Sprints
          </Heading>
          <Text color={subTextColor} fontSize="sm">
            Plan sprints, assign backlog items, and track sprint execution.
          </Text>
        </Box>
        <HStack spacing={3}>
          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            borderRadius="full"
            onClick={onOpenCreateSprint}
          >
            Create Sprint
          </Button>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            borderRadius="full"
            onClick={() => onOpenCreateTask()}
          >
            Add to Backlog
          </Button>
        </HStack>
      </HStack>

      {/* Sprints List */}
      {sprints.map((sprint) => {
        const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
        const completedTasks = sprintTasks.filter(
          (t) => t.status === "Completed"
        ).length;
        const progress =
          sprintTasks.length > 0
            ? Math.round((completedTasks / sprintTasks.length) * 100)
            : 0;

        return (
          <Card
            key={sprint.id}
            bg={cardBg}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            overflow="hidden"
          >
            <CardBody p={5}>
              <VStack align="stretch" spacing={4}>
                {/* Sprint Title Bar */}
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
                  <HStack spacing={3}>
                    <Heading size="md" fontWeight="bold">
                      {sprint.name}
                    </Heading>
                    <Badge colorScheme="blue" borderRadius="full" px={2.5} py={0.5}>
                      {sprintTasks.length} Tasks
                    </Badge>
                    <HStack fontSize="xs" color={subTextColor}>
                      <Icon as={FiCalendar} />
                      <Text>
                        {sprint.startDate
                          ? new Date(sprint.startDate).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {sprint.endDate
                          ? new Date(sprint.endDate).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      leftIcon={<AddIcon boxSize={2} />}
                      borderRadius="md"
                      onClick={() => onOpenCreateTask(sprint.id)}
                    >
                      Add Task
                    </Button>
                  </HStack>
                </Flex>

                {/* Progress bar */}
                <Box>
                  <Flex justify="space-between" fontSize="xs" color={subTextColor} mb={1}>
                    <Text>Progress: {completedTasks} / {sprintTasks.length} tasks completed</Text>
                    <Text fontWeight="bold">{progress}%</Text>
                  </Flex>
                  <Progress
                    value={progress}
                    colorScheme="blue"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>

                <Divider borderColor={borderColor} />

                {/* Sprint Task Rows */}
                <VStack align="stretch" spacing={2}>
                  {sprintTasks.length === 0 ? (
                    <Text fontSize="sm" color="gray.400" py={2} textAlign="center">
                      No tasks in this sprint. Drag or move tasks from backlog here.
                    </Text>
                  ) : (
                    sprintTasks.map((task) => (
                      <Flex
                        key={task.id}
                        p={3}
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                        justify="space-between"
                        align="center"
                        _hover={{ bg: backlogBg }}
                        cursor="pointer"
                        onClick={() => onSelectTask(task)}
                      >
                        <HStack spacing={3} flex={1}>
                          <Badge
                            colorScheme={priorityColorMap[task.priority]}
                            fontSize="xs"
                            borderRadius="full"
                            px={2}
                          >
                            {task.priority}
                          </Badge>
                          <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                            {task.title}
                          </Text>
                        </HStack>

                        <HStack spacing={4} onClick={(e) => e.stopPropagation()}>
                          <Select
                            size="xs"
                            value={task.sprintId || ""}
                            onChange={(e) =>
                              handleMoveTaskSprint(task.id, e.target.value)
                            }
                            w="150px"
                            borderRadius="md"
                          >
                            <option value="">Backlog</option>
                            {sprints.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </Select>

                          <Badge
                            colorScheme={
                              task.status === "Completed"
                                ? "green"
                                : task.status === "In Progress"
                                ? "blue"
                                : "purple"
                            }
                            fontSize="xs"
                            borderRadius="full"
                            px={2}
                          >
                            {task.status}
                          </Badge>
                        </HStack>
                      </Flex>
                    ))
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        );
      })}

      {/* Backlog Section */}
      <Card
        bg={cardBg}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="sm"
      >
        <CardBody p={5}>
          <VStack align="stretch" spacing={4}>
            <Flex justify="space-between" align="center">
              <HStack spacing={3}>
                <Heading size="md" fontWeight="bold">
                  Backlog (Unassigned Tasks)
                </Heading>
                <Badge colorScheme="purple" borderRadius="full" px={2.5} py={0.5}>
                  {backlogTasks.length} Tasks
                </Badge>
              </HStack>

              <Button
                size="xs"
                colorScheme="blue"
                leftIcon={<AddIcon boxSize={2} />}
                borderRadius="md"
                onClick={() => onOpenCreateTask()}
              >
                Add to Backlog
              </Button>
            </Flex>

            <Divider borderColor={borderColor} />

            <VStack align="stretch" spacing={2}>
              {backlogTasks.length === 0 ? (
                <Text fontSize="sm" color="gray.400" py={3} textAlign="center">
                  Backlog is empty! Create tasks to start planning upcoming sprints.
                </Text>
              ) : (
                backlogTasks.map((task) => (
                  <Flex
                    key={task.id}
                    p={3}
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor={borderColor}
                    justify="space-between"
                    align="center"
                    _hover={{ bg: backlogBg }}
                    cursor="pointer"
                    onClick={() => onSelectTask(task)}
                  >
                    <HStack spacing={3} flex={1}>
                      <Badge
                        colorScheme={priorityColorMap[task.priority]}
                        fontSize="xs"
                        borderRadius="full"
                        px={2}
                      >
                        {task.priority}
                      </Badge>
                      <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                        {task.title}
                      </Text>
                    </HStack>

                    <HStack spacing={4} onClick={(e) => e.stopPropagation()}>
                      <Select
                        size="xs"
                        value=""
                        placeholder="Move to Sprint..."
                        onChange={(e) =>
                          handleMoveTaskSprint(task.id, e.target.value)
                        }
                        w="160px"
                        borderRadius="md"
                      >
                        {sprints.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </Select>

                      <Badge
                        colorScheme={
                          task.status === "Completed"
                            ? "green"
                            : task.status === "In Progress"
                            ? "blue"
                            : "purple"
                        }
                        fontSize="xs"
                        borderRadius="full"
                        px={2}
                      >
                        {task.status}
                      </Badge>
                    </HStack>
                  </Flex>
                ))
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
