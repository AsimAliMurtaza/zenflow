"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  Progress,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { Project, Sprint, Task } from "@/types/types";

const ProjectOverview = ({ project }: { project: Project | null }) => {
  const { projectID } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<string>("In Progress");

  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const badgeBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const badgeColorSchemes = {
    Completed: "green",
    "In Progress": "yellow",
    "To Do": "gray",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${projectID}/tasks`);
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data);

        const allTasksCompleted = data.every(
          (task: Task) => task.status === "Completed"
        );
        setProjectStatus(allTasksCompleted ? "Completed" : "In Progress");
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    if (projectID) fetchTasks();
  }, [projectID]);

  if (!project) {
    return (
      <Center h="200px">
        <Text fontSize="lg" color="red.500">
          Project not found.
        </Text>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px" color="red.500">
        {error}
      </Center>
    );
  }

  const tasksDone = tasks.filter((task) => task.status === "Completed").length;
  const tasksInProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (tasksDone / totalTasks) * 100 : 0;

  return (
    <Box p={4} bg={bg} borderRadius="xl" boxShadow="md">
      <Heading size="2xl" mb={2} fontWeight="semibold" color={headingColor}>
        {project.name}
      </Heading>
      <Text fontSize="md" mb={8} color={textColor}>
        {project.description}
      </Text>

      <VStack align="start" spacing={6}>
        <Badge
          colorScheme={projectStatus === "Completed" ? "green" : "blue"}
          fontSize="md"
          px={3}
          py={1}
          borderRadius="full"
          variant="solid"
        >
          Status: {projectStatus}
        </Badge>

        <Box w="full">
          <Text fontSize="md" mb={2} color={textColor}>
            Progress: {tasksDone}/{totalTasks} tasks completed
          </Text>
          <Progress
            value={progress}
            size="lg"
            colorScheme="green"
            borderRadius="full"
            hasStripe
            isAnimated
            sx={{
              "--progress-bar-bg":
                "linear-gradient(to right, #63B3ED, #3182CE)",
            }}
          />
        </Box>

        <Box w="full">
          <Text fontSize="md" mb={2} color={textColor}>
            Task Status:
          </Text>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color={textColor}>
              <Badge
                colorScheme="green"
                borderRadius="full"
                px={2}
                py={1}
                bg={badgeBg}
              >
                Completed
              </Badge>{" "}
              {tasksDone} tasks
            </Text>
            <Text fontSize="sm" color={textColor}>
              <Badge
                colorScheme="yellow"
                borderRadius="full"
                px={2}
                py={1}
                bg={badgeBg}
              >
                In Progress
              </Badge>{" "}
              {tasksInProgress} tasks
            </Text>
            <Text fontSize="sm" color={textColor}>
              <Badge
                colorScheme="gray"
                borderRadius="full"
                px={2}
                py={1}
                bg={badgeBg}
              >
                To Do
              </Badge>{" "}
              {totalTasks - tasksDone - tasksInProgress} tasks
            </Text>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <Card bg={cardBg} borderRadius="xl" boxShadow="md">
            <CardHeader>
              <Heading size="md" fontWeight="semibold" color={headingColor}>
                Tasks
              </Heading>
            </CardHeader>
            <CardBody>
              {tasks.length === 0 ? (
                <Text color={textColor}>No tasks found for this project.</Text>
              ) : (
                tasks.map((task) => (
                  <Box key={task._id} mb={4} p={3} borderRadius="lg" bg={badgeBg}>
                    <Text fontWeight="medium" color={headingColor}>{task.title}</Text>
                    <Text fontSize="sm" color={textColor}>
                      {task.description}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Assigned to: {task.assignedTo?.name || "Unassigned"}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </Text>
                    <Badge
                      colorScheme={badgeColorSchemes[task.status]}
                      borderRadius="full"
                      px={2}
                      py={1}
                      fontSize="xs"
                      variant="solid"
                      mt={2}
                    >
                      {task.status}
                    </Badge>
                  </Box>
                ))
              )}
            </CardBody>
          </Card>

          <Card bg={cardBg} borderRadius="xl" boxShadow="md">
            <CardHeader>
              <Heading size="md" fontWeight="semibold" color={headingColor}>
                Sprints
              </Heading>
            </CardHeader>
            <CardBody>
              {!project.sprints || project.sprints.length === 0 ? (
                <Text color={textColor}>No sprints found for this project.</Text>
              ) : (
                project.sprints.map((sprint: Sprint) => (
                  <Box key={sprint._id} mb={4} p={3} borderRadius="lg" bg={badgeBg}>
                    <Text fontWeight="medium" color={headingColor}>{sprint.name}</Text>
                    <Text fontSize="sm" color={textColor}>
                      {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                      {new Date(sprint.endDate).toLocaleDateString()}
                    </Text>
                  </Box>
                ))
              )}
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ProjectOverview;