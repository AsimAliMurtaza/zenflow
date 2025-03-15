"use client";

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

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: { name: string };
  dueDate: string;
};

type Sprint = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
};

type Project = {
  _id: string;
  name: string;
  description: string;
  status: string;
  assignedTeam: { name: string };
  tasks: Task[];
  sprints: Sprint[];
};

const ProjectOverview = ({
  project = {
    _id: "",
    name: "",
    description: "",
    status: "",
    assignedTeam: { name: "" },
    tasks: [],
    sprints: [],
  },
}: {
  project?: Project;
}) => {
  if (!project) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  const tasksDone = project.tasks.filter(
    (task) => task.status === "Done"
  ).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (tasksDone / totalTasks) * 100 : 0;

  return (
    <Box p={8}>
      <Heading size="2xl" mb={6}>
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

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <Card>
            <CardHeader>
              <Heading size="md">Tasks</Heading>
            </CardHeader>
            <CardBody>
              {project.tasks.map((task) => (
                <Box key={task._id} mb={4}>
                  <Text fontWeight="bold">{task.title}</Text>
                  <Text>{task.description}</Text>
                  <Text>
                    Assigned to: {task.assignedTo?.name || "Unassigned"}
                  </Text>
                  <Text>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Sprints</Heading>
            </CardHeader>
            <CardBody>
              {project.sprints.map((sprint) => (
                <Box key={sprint._id} mb={4}>
                  <Text fontWeight="bold">{sprint.name}</Text>
                  <Text>
                    {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                    {new Date(sprint.endDate).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ProjectOverview;
