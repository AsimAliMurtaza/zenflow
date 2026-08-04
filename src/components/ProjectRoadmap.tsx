"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Spinner,
  Center,
  Progress,
  Tooltip,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { Sprint, Task } from "@/types/types";

interface ProjectRoadmapProps {
  projectId: string;
}

export const ProjectRoadmap = ({ projectId }: ProjectRoadmapProps) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const rowBg = useColorModeValue("gray.50", "gray.750");
  const textColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sprintRes, taskRes] = await Promise.all([
          fetch(`/api/projects/${projectId}/sprints`),
          fetch(`/api/projects/${projectId}/tasks`),
        ]);
        if (sprintRes.ok) {
          const sData = await sprintRes.json();
          setSprints(sData);
        }
        if (taskRes.ok) {
          const tData = await taskRes.json();
          setTasks(tData);
        }
      } catch (err) {
        console.error("Roadmap fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <Center h="250px">
        <Spinner size="lg" color="blue.500" thickness="3px" />
      </Center>
    );
  }

  const priorityColorMap = {
    High: "red",
    Medium: "orange",
    Low: "green",
  };

  const statusColorMap = {
    "To Do": "gray",
    "In Progress": "blue",
    Completed: "green",
  };

  return (
    <Box bg={bg} p={5} borderRadius="2xl" shadow="sm" border="1px solid" borderColor={borderColor}>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              📅 Project Timeline & Roadmap
            </Text>
            <Text fontSize="xs" color="gray.500">
              Visual sprint timeline, milestones, and task schedules
            </Text>
          </Box>
          <HStack spacing={2}>
            <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
              {sprints.length} Sprints
            </Badge>
            <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
              {tasks.length} Total Tasks
            </Badge>
          </HStack>
        </Flex>

        {/* Sprint Timeline Rows */}
        {sprints.length === 0 ? (
          <Box textStyle="center" py={8} textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No sprints created for this project yet. Create a sprint to see the roadmap timeline.
            </Text>
          </Box>
        ) : (
          sprints.map((sprint) => {
            const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
            const completedCount = sprintTasks.filter((t) => t.status === "Completed").length;
            const progress =
              sprintTasks.length > 0 ? Math.round((completedCount / sprintTasks.length) * 100) : 0;

            const startDateFormatted = new Date(sprint.startDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
            const endDateFormatted = new Date(sprint.endDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });

            return (
              <Box
                key={sprint.id}
                p={4}
                bg={rowBg}
                borderRadius="xl"
                borderLeft="4px solid"
                borderLeftColor="blue.500"
              >
                {/* Sprint Details */}
                <Flex justify="space-between" align="center" mb={3}>
                  <Box>
                    <HStack spacing={3}>
                      <Text fontWeight="bold" fontSize="md" color={textColor}>
                        🏃 {sprint.name}
                      </Text>
                      <Badge colorScheme="blue" variant="subtle" borderRadius="md">
                        {startDateFormatted} — {endDateFormatted}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" mt={0.5}>
                      {completedCount} of {sprintTasks.length} tasks completed ({progress}%)
                    </Text>
                  </Box>
                  <Box w="180px">
                    <Progress value={progress} size="sm" colorScheme="blue" borderRadius="full" />
                  </Box>
                </Flex>

                {/* Tasks inside this sprint */}
                <VStack align="stretch" spacing={2.5} pl={4} pt={2} borderLeft="2px dashed" borderColor={borderColor}>
                  {sprintTasks.length === 0 ? (
                    <Text fontSize="xs" color="gray.400" fontStyle="italic">
                      No tasks assigned to this sprint yet.
                    </Text>
                  ) : (
                    sprintTasks.map((task) => (
                      <Flex
                        key={task.id}
                        justify="space-between"
                        align="center"
                        p={2.5}
                        bg={bg}
                        borderRadius="lg"
                        shadow="xs"
                      >
                        <HStack spacing={3} flex={1}>
                          <Badge
                            colorScheme={statusColorMap[task.status] || "gray"}
                            fontSize="10px"
                            borderRadius="full"
                            px={2}
                          >
                            {task.status}
                          </Badge>
                          <Text fontSize="sm" fontWeight="semibold" color={textColor} noOfLines={1}>
                            {task.title}
                          </Text>
                        </HStack>

                        <HStack spacing={4}>
                          <Badge
                            colorScheme={priorityColorMap[task.priority]}
                            variant="outline"
                            fontSize="10px"
                          >
                            {task.priority}
                          </Badge>

                          {task.dueDate && (
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              Due: {new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })}
                            </Text>
                          )}

                          {task.assignees && task.assignees.length > 0 && (
                            <AvatarGroup size="xs" max={2}>
                              {task.assignees.map((a, i) => (
                                <Tooltip key={i} label={a.userEmail}>
                                  <Avatar name={a.userEmail} size="xs" />
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          )}
                        </HStack>
                      </Flex>
                    ))
                  )}
                </VStack>
              </Box>
            );
          })
        )}

        {/* Backlog Tasks Section */}
        {tasks.filter((t) => !t.sprintId).length > 0 && (
          <Box p={4} bg={rowBg} borderRadius="xl" borderLeft="4px solid" borderLeftColor="purple.400">
            <Text fontWeight="bold" fontSize="md" color={textColor} mb={3}>
              📦 Unassigned Backlog Items ({tasks.filter((t) => !t.sprintId).length})
            </Text>
            <VStack align="stretch" spacing={2}>
              {tasks
                .filter((t) => !t.sprintId)
                .map((task) => (
                  <Flex
                    key={task.id}
                    justify="space-between"
                    align="center"
                    p={2.5}
                    bg={bg}
                    borderRadius="lg"
                  >
                    <HStack spacing={3}>
                      <Badge colorScheme="purple" fontSize="10px" borderRadius="full" px={2}>
                        {task.status}
                      </Badge>
                      <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        {task.title}
                      </Text>
                    </HStack>
                    <Badge colorScheme={priorityColorMap[task.priority]} fontSize="10px">
                      {task.priority}
                    </Badge>
                  </Flex>
                ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
