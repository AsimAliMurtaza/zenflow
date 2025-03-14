"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  Card,
  CardBody,
  VStack,
  Badge,
  Button,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useDisclosure,
  useToast,
  useColorMode,
  useColorModeValue,
  Avatar,
  AvatarGroup,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, CheckIcon, TimeIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

// Sample team data
const teams = [
  { id: "1", name: "AI Research Team" },
  { id: "2", name: "Web Dev Team" },
  { id: "3", name: "E-Commerce Team" },
];

// Initial Projects
const initialProjects = [
  {
    id: "1",
    name: "AI Chatbot",
    description: "A real-time AI chatbot using Next.js, FastAPI, and Llama3.",
    completion: 80,
    status: "In Progress",
    assignedTeam: "AI Research Team",
    teamMembers: ["Alice", "Bob", "Charlie"],
    dueDate: "2024-03-15",
  },
  {
    id: "2",
    name: "Smart Notes",
    description: "A notes app with MongoDB, Chakra UI, and Next.js.",
    completion: 100,
    status: "Completed",
    assignedTeam: "Web Dev Team",
    teamMembers: ["David", "Eve"],
    dueDate: "2024-02-10",
  },
];

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [completion, setCompletion] = useState(0);
  const [status, setStatus] = useState("In Progress");
  const [assignedTeam, setAssignedTeam] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const router = useRouter();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const progressColor = useColorModeValue("blue", "cyan");

  // Open modal for adding or editing
  const openModal = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setDescription(project.description);
      setCompletion(project.completion);
      setStatus(project.status);
      setAssignedTeam(project.assignedTeam);
      setTeamMembers(project.teamMembers || []);
      setDueDate(project.dueDate || "");
    } else {
      setEditingProject(null);
      setProjectName("");
      setDescription("");
      setCompletion(0);
      setStatus("In Progress");
      setAssignedTeam("");
      setTeamMembers([]);
      setDueDate("");
    }
    onOpen();
  };

  // Add or Update Project
  const handleSaveProject = () => {
    if (!projectName.trim() || !description.trim()) {
      toast({ title: "Name and description are required.", status: "warning" });
      return;
    }

    if (editingProject) {
      // Update existing project
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.id === editingProject.id
            ? {
                ...proj,
                name: projectName,
                description,
                completion,
                status,
                assignedTeam,
                teamMembers,
                dueDate,
              }
            : proj
        )
      );
      toast({ title: "Project updated!", status: "success" });
    } else {
      // Add new project
      const newProject = {
        id: Date.now().toString(),
        name: projectName,
        description,
        completion,
        status,
        assignedTeam,
        teamMembers,
        dueDate,
      };
      setProjects([...projects, newProject]);
      toast({ title: "Project added!", status: "success" });
    }

    onClose();
  };

  // Remove Project
  const removeProject = (id: string) => {
    setProjects(projects.filter((proj) => proj.id !== id));
    toast({ title: "Project deleted.", status: "error" });
  };

  // Handle Project Click
  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
  };

  return (
    <Box p={8} bg={bgColor} color={textColor} borderRadius="lg">
      <Heading size="2xl" mb={6} fontWeight="bold">
        Projects Management
      </Heading>
      <Text fontSize="lg" mb={8} color={useColorModeValue("gray.600", "gray.300")}>
        Manage your projects, track progress, and assign teams.
      </Text>

      <Button
        bg={colorMode === "light" ? "gray.700" : "gray.600"}
        color={"white"}
        _hover={{
          bg: colorMode === "light" ? "gray.800" : "gray.500",
        }}
        leftIcon={<AddIcon />}
        onClick={() => openModal()}
        mb={8}
        size="lg"
        borderRadius="full"
      >
        Add Project
      </Button>

      {/* Projects Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {projects.map((project) => (
          <Card
            onClick={() => handleProjectClick(project.id)}
            key={project.id}
            p={6}
            borderRadius="2xl"
            shadow="lg"
            bg={cardBg}
            _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
          >
            <CardBody>
              <HStack justify="space-between">
                <Heading size="lg" fontWeight="semibold">
                  {project.name}
                </Heading>
                <HStack>
                  <IconButton
                    aria-label="Edit project"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(project);
                    }}
                  />
                  <IconButton
                    aria-label="Delete project"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(project.id);
                    }}
                  />
                </HStack>
              </HStack>

              <Text fontSize="md" color="gray.500" mt={2} mb={4}>
                {project.description}
              </Text>

              <Progress
                value={project.completion}
                colorScheme={progressColor}
                size="sm"
                borderRadius="full"
                mb={4}
              />

              <VStack align="start" spacing={3}>
                <Badge
                  colorScheme={
                    project.status === "Completed" ? "green" : "yellow"
                  }
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {project.status}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Completion: {project.completion}%
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  Team: {project.assignedTeam || "Not Assigned"}
                </Text>
                <AvatarGroup size="sm" max={3}>
                  {project.teamMembers?.map((member, index) => (
                    <Avatar key={index} name={member} />
                  ))}
                </AvatarGroup>
                <Tag
                  colorScheme={project.dueDate ? "red" : "gray"}
                  borderRadius="full"
                >
                  <TagLeftIcon as={TimeIcon} />
                  <TagLabel>
                    Due: {project.dueDate || "No due date"}
                  </TagLabel>
                </Tag>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Add/Edit Project Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor} color={textColor} borderRadius="2xl">
          <ModalHeader fontSize="2xl" fontWeight="bold">
            {editingProject ? "Edit Project" : "Add Project"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              mb={4}
              borderRadius="lg"
            />
            <Input
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              mb={4}
              borderRadius="lg"
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              mb={4}
              borderRadius="lg"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Almost Done">Almost Done</option>
            </Select>
            <Select
              placeholder="Assign Team"
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value)}
              mb={4}
              borderRadius="lg"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </Select>
            <Input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              mb={4}
              borderRadius="lg"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSaveProject}
              mr={3}
              borderRadius="full"
            >
              {editingProject ? "Update" : "Save"}
            </Button>
            <Button onClick={onClose} borderRadius="full">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Projects;