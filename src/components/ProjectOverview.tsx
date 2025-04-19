"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Center,
  useColorModeValue,
  IconButton,
  Divider,
  Flex,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiPlus } from "react-icons/fi";
import { Project, Sprint, Task } from "@/types/types";

const ProjectOverview = ({ project }: { project: Project | null }) => {
  const { projectID } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<
    "Completed" | "In Progress"
  >("In Progress");
  const [newSprint, setNewSprint] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [isAddingSprint, setIsAddingSprint] = useState(false);
  const toast = useToast();
  const [editingSprintId, setEditingSprintId] = useState<string | null>(null);
  const [editedSprint, setEditedSprint] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const surfaceBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const progressTrackBg = useColorModeValue("gray.200", "gray.600");

  const badgeColorSchemes = {
    Completed: "green",
    "In Progress": "blue",
    "To Do": "gray",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${projectID}/tasks`);
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data);

        // Calculate project status
        const hasTasks = data.length > 0;
        const allTasksCompleted =
          hasTasks && data.every((task: Task) => task.status === "Completed");

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
      <Center minH="200px" bg={surfaceBg} borderRadius="xl" p={6}>
        <Text fontSize="lg" color="red.500">
          Project not found.
        </Text>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center minH="200px" bg={surfaceBg} borderRadius="xl" p={6}>
        <Spinner size="xl" thickness="3px" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="200px" bg={surfaceBg} borderRadius="xl" p={6}>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  const tasksDone = tasks.filter((task) => task.status === "Completed").length;
  const tasksInProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (tasksDone / totalTasks) * 100 : 0;

  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSprint({ ...newSprint, [e.target.name]: e.target.value });
  };

  const handleAddSprint = async () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) {
      toast({
        title: "All fields required",
        status: "warning",
        position: "top-right",
        variant: "subtle",
      });
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectID}/sprints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSprint),
      });

      if (!res.ok) throw new Error("Failed to add sprint");

      const { sprint } = await res.json();

      setNewSprint({ name: "", startDate: "", endDate: "" });
      setIsAddingSprint(false);
      toast({
        title: "Sprint added!",
        status: "success",
        position: "top-right",
        variant: "subtle",
      });

      if (project && project.sprints) {
        project.sprints = [...project.sprints, sprint];
      } else if (project) {
        project.sprints = [sprint];
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add sprint",
        status: "error",
        position: "top-right",
        variant: "subtle",
      });
    }
  };

  const startEditingSprint = (sprint: Sprint) => {
    setEditingSprintId(sprint._id);
    setEditedSprint({
      name: sprint.name,
      startDate: sprint.startDate
        ? (typeof sprint.startDate === "string"
            ? sprint.startDate
            : sprint.startDate.toISOString()
          ).slice(0, 10)
        : "",
      endDate: sprint.endDate
        ? (typeof sprint.endDate === "string"
            ? sprint.endDate
            : sprint.endDate.toISOString()
          ).slice(0, 10)
        : "",
    });
  };

  const handleEditSprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSprint({ ...editedSprint, [e.target.name]: e.target.value });
  };

  const handleUpdateSprint = async (sprintID: string) => {
    try {
      const res = await fetch(
        `/api/projects/${projectID}/sprints/${sprintID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedSprint),
        }
      );

      if (!res.ok) throw new Error("Failed to update sprint");

      toast({
        title: "Sprint updated",
        status: "success",
        position: "top-right",
        variant: "subtle",
      });

      const updatedSprint = await res.json();
      if (project && project.sprints) {
        project.sprints = project.sprints.map((s) =>
          s._id === sprintID ? updatedSprint : s
        );
      }
      setEditingSprintId(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update sprint",
        status: "error",
        position: "top-right",
        variant: "subtle",
      });
    }
  };

  const handleDeleteSprint = async (sprintID: string) => {
    try {
      const res = await fetch(
        `/api/projects/${projectID}/sprints/${sprintID}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete sprint");

      toast({
        title: "Sprint deleted",
        status: "info",
        position: "top-right",
        variant: "subtle",
      });

      if (project && project.sprints) {
        project.sprints = project.sprints.filter((s) => s._id !== sprintID);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete sprint",
        status: "error",
        position: "top-right",
        variant: "subtle",
      });
    }
  };

  return (
    <Box p={{ base: 4, md: 6 }} bg={surfaceBg} borderRadius="2xl">
      <VStack align="start" spacing={6}>
        {/* Project Header */}
        <Box boxShadow="lg" w="full" p="4" borderRadius="xl">
          <Heading size="xl" mb={2} fontWeight="semibold" color={headingColor}>
            {project.name}
          </Heading>
          <Text fontSize="lg" color={textColor}>
            {project.description}
          </Text>
          <Badge
            colorScheme={badgeColorSchemes[projectStatus]}
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
            variant="subtle"
            mt={3}
          >
            {projectStatus}
          </Badge>
        </Box>

        {/* Progress Section */}
        <Card w="full" bg={cardBg} borderRadius="xl" boxShadow="lg">
          <CardHeader pb={0}>
            <Heading size="md">Project Progress</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color={textColor}>
                    {tasksDone}/{totalTasks} tasks completed
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {Math.round(progress)}%
                  </Text>
                </HStack>
                <Progress
                  value={progress}
                  size="md"
                  colorScheme="blue"
                  borderRadius="full"
                  bg={progressTrackBg}
                  hasStripe
                  isAnimated
                />
              </Box>

              <SimpleGrid columns={3} spacing={4} w="full">
                <Box textAlign="center">
                  <Text fontSize="sm" color={textColor} mb={1}>
                    Completed
                  </Text>
                  <Badge
                    colorScheme="green"
                    borderRadius="full"
                    px={3}
                    py={1}
                    variant="subtle"
                    fontSize="sm"
                  >
                    {tasksDone}
                  </Badge>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" color={textColor} mb={1}>
                    In Progress
                  </Text>
                  <Badge
                    colorScheme="blue"
                    borderRadius="full"
                    px={3}
                    py={1}
                    variant="subtle"
                    fontSize="sm"
                  >
                    {tasksInProgress}
                  </Badge>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="sm" color={textColor} mb={1}>
                    To Do
                  </Text>
                  <Badge
                    colorScheme="gray"
                    borderRadius="full"
                    px={3}
                    py={1}
                    variant="subtle"
                    fontSize="sm"
                  >
                    {totalTasks - tasksDone - tasksInProgress}
                  </Badge>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Tasks and Sprints Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          {/* Tasks Card */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="sm">
            <CardHeader>
              <Heading size="md">Tasks</Heading>
            </CardHeader>
            <Divider borderColor={dividerColor} />
            <CardBody>
              {tasks.length === 0 ? (
                <Text color={textColor} textAlign="center" py={4}>
                  No tasks found for this project.
                </Text>
              ) : (
                <VStack align="stretch" spacing={4}>
                  {tasks.map((task) => (
                    <Box
                      key={task._id}
                      p={4}
                      borderRadius="lg"
                      borderWidth="1px"
                      boxShadow="lg"
                      borderColor={dividerColor}
                    >
                      <Flex justify="space-between" align="start">
                        <Box>
                          <Text fontWeight="medium" color={headingColor}>
                            {task.title}
                          </Text>
                          <Text fontSize="sm" color={textColor} mt={1}>
                            {task.description}
                          </Text>
                        </Box>
                        <Box display="flex" flexDirection="column" gap="2">
                          <Badge
                            colorScheme={badgeColorSchemes[task.status]}
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            variant="subtle"
                          >
                            {task.status}
                          </Badge>
                          <Badge
                            colorScheme={"orange"}
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            variant="subtle"
                          >
                            {task.sprint.name}
                          </Badge>
                        </Box>
                      </Flex>

                      <HStack mt={3} spacing={4}>
                        <Box>
                          <Text fontSize="xs" color={textColor}>
                            Assigned
                          </Text>
                          <AvatarGroup size="sm" max={3} mt={1}>
                            {Array.isArray(task.assignedTo) &&
                              task.assignedTo.map((member: string) => (
                                <Avatar key={member} name={member} />
                              ))}
                          </AvatarGroup>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color={textColor}>
                            Due Date
                          </Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "No due date"}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </CardBody>
          </Card>

          {/* Sprints Card */}
          <Card bg={cardBg} borderRadius="xl" boxShadow="sm">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Sprints</Heading>
                <IconButton
                  aria-label="Add sprint"
                  icon={<FiPlus />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingSprint(true)}
                />
              </Flex>
            </CardHeader>
            <Divider borderColor={dividerColor} />
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {isAddingSprint && (
                  <Box
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={dividerColor}
                  >
                    <VStack align="stretch" spacing={3}>
                      <FormControl>
                        <FormLabel fontSize="sm">Sprint Name</FormLabel>
                        <Input
                          name="name"
                          value={newSprint.name}
                          onChange={handleSprintChange}
                          placeholder="Sprint name"
                          bg={inputBg}
                          size="sm"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Start Date</FormLabel>
                        <Input
                          name="startDate"
                          type="date"
                          value={newSprint.startDate}
                          onChange={handleSprintChange}
                          bg={inputBg}
                          size="sm"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">End Date</FormLabel>
                        <Input
                          name="endDate"
                          type="date"
                          value={newSprint.endDate}
                          onChange={handleSprintChange}
                          bg={inputBg}
                          size="sm"
                        />
                      </FormControl>
                      <HStack justify="end" spacing={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsAddingSprint(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={handleAddSprint}
                        >
                          Add Sprint
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                )}

                {!project.sprints || project.sprints.length === 0 ? (
                  <Text color={textColor} textAlign="center" py={4}>
                    No sprints found for this project.
                  </Text>
                ) : (
                  project.sprints.map((sprint: Sprint) => (
                    <Box
                      key={sprint._id}
                      p={4}
                      borderRadius="lg"
                      boxShadow="lg"
                      borderWidth="1px"
                      borderColor={dividerColor}
                    >
                      {editingSprintId === sprint._id ? (
                        <VStack align="stretch" spacing={3}>
                          <FormControl>
                            <FormLabel fontSize="sm">Sprint Name</FormLabel>
                            <Input
                              name="name"
                              value={editedSprint.name}
                              onChange={handleEditSprintChange}
                              bg={inputBg}
                              size="sm"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Start Date</FormLabel>
                            <Input
                              name="startDate"
                              type="date"
                              value={editedSprint.startDate}
                              onChange={handleEditSprintChange}
                              bg={inputBg}
                              size="sm"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">End Date</FormLabel>
                            <Input
                              name="endDate"
                              type="date"
                              value={editedSprint.endDate}
                              onChange={handleEditSprintChange}
                              bg={inputBg}
                              size="sm"
                            />
                          </FormControl>
                          <HStack justify="end" spacing={2}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingSprintId(null)}
                              leftIcon={<FiX />}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleUpdateSprint(sprint._id)}
                              leftIcon={<FiCheck />}
                            >
                              Save
                            </Button>
                          </HStack>
                        </VStack>
                      ) : (
                        <>
                          <Flex justify="space-between" align="start">
                            <Box>
                              <Text fontWeight="medium" color={headingColor}>
                                {sprint.name}
                              </Text>
                              <Text fontSize="sm" color={textColor} mt={1}>
                                {sprint.startDate
                                  ? new Date(
                                      sprint.startDate
                                    ).toLocaleDateString()
                                  : "N/A"}{" "}
                                -{" "}
                                {sprint.endDate
                                  ? new Date(
                                      sprint.endDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </Text>
                            </Box>
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="Edit sprint"
                                icon={<FiEdit2 />}
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditingSprint(sprint)}
                              />
                              <IconButton
                                aria-label="Delete sprint"
                                icon={<FiTrash2 />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDeleteSprint(sprint._id)}
                              />
                            </HStack>
                          </Flex>
                        </>
                      )}
                    </Box>
                  ))
                )}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ProjectOverview;
