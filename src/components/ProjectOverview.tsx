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
} from "@chakra-ui/react";
import { Project, Sprint, Task } from "@/types/types";

const ProjectOverview = ({ project }: { project: Project | null }) => {
  const { projectID } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${projectID}/tasks`);
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data);
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
    <Box p={2}>
      <Heading size="xl" mb={0}>
        {project.name}
      </Heading>
      <Text fontSize="lg" mb={8}>
        {project.description}
      </Text>

      <VStack align="start" spacing={6}>
        <Badge
          colorScheme="blue"
          fontSize="lg"
          px={4}
          py={2}
          borderRadius="full"
        >
          Status: {project.status}
        </Badge>

        <Box w="full">
          <Text fontSize="lg" mb={2}>
            Progress: {tasksDone}/{totalTasks} tasks completed
          </Text>
          <Progress
            value={progress}
            size="lg"
            colorScheme="green"
            borderRadius="full"
          />
        </Box>

        <Box w="full">
          <Text fontSize="lg" mb={2}>
            Task Status:
          </Text>
          <VStack align="start" spacing={2}>
            <Text>
              <Badge colorScheme="green" borderRadius="full" px={2} py={1}>
                Completed
              </Badge>{" "}
              {tasksDone} tasks
            </Text>
            <Text>
              <Badge colorScheme="yellow" borderRadius="full" px={2} py={1}>
                In Progress
              </Badge>{" "}
              {tasksInProgress} tasks
            </Text>
            <Text>
              <Badge colorScheme="gray" borderRadius="full" px={2} py={1}>
                To Do
              </Badge>{" "}
              {totalTasks - tasksDone - tasksInProgress} tasks
            </Text>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          {/* Tasks Card */}
          <Card>
            <CardHeader>
              <Heading size="md">Tasks</Heading>
            </CardHeader>
            <CardBody>
              {tasks.length === 0 ? (
                <Text>No tasks found for this project.</Text>
              ) : (
                tasks.map((task) => (
                  <Box key={task._id} mb={4}>
                    <Text fontWeight="bold">{task.title}</Text>
                    <Text>{task.description}</Text>
                    <Text>
                      Assigned to: {task.assignedTo?.name|| "Unassigned"}
                    </Text>
                    <Text>
                      Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </Text>
                    <Badge
                      colorScheme={
                        task.status === "Completed"
                          ? "green"
                          : task.status === "In Progress"
                          ? "yellow"
                          : "gray"
                      }
                      borderRadius="full"
                      px={2}
                      py={1}
                    >
                      {task.status}
                    </Badge>
                  </Box>
                ))
              )}
            </CardBody>
          </Card>

          {/* Sprints Card */}
          <Card>
            <CardHeader>
              <Heading size="md">Sprints</Heading>
            </CardHeader>
            <CardBody>
              {!project.sprints || project.sprints.length === 0 ? (
                <Text>No sprints found for this project.</Text>
              ) : (
                project.sprints.map((sprint: Sprint) => (
                  <Box key={sprint._id} mb={4}>
                    <Text fontWeight="bold">{sprint.name}</Text>
                    <Text>
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
