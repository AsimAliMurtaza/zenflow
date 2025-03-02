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
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

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
  },
  {
    id: "2",
    name: "Smart Notes",
    description: "A notes app with MongoDB, Chakra UI, and Next.js.",
    completion: 100,
    status: "Completed",
    assignedTeam: "Web Dev Team",
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();

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
    } else {
      setEditingProject(null);
      setProjectName("");
      setDescription("");
      setCompletion(0);
      setStatus("In Progress");
      setAssignedTeam("");
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

  return (
    <Box p={6} bg={bgColor} color={textColor} borderRadius="lg">
      <Heading size="xl" mb={6}>
    Projects Management
      </Heading>
      <Text fontSize="lg" mb={4}>
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
        mb={6}
      >
        Add Project
      </Button>

      {/* Projects Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {projects.map((project) => (
          <Card key={project.id} p={4} borderRadius="lg" shadow="md" bg={cardBg}>
            <CardBody>
              <HStack justify="space-between">
                <Heading size="md">{project.name}</Heading>
                <HStack>
                  <IconButton
                    aria-label="Edit project"
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() => openModal(project)}
                  />
                  <IconButton
                    aria-label="Delete project"
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() => removeProject(project.id)}
                  />
                </HStack>
              </HStack>

              <Text fontSize="sm" color="gray.500" mt={2} mb={3}>
                {project.description}
              </Text>

              <Progress
                value={project.completion}
                colorScheme={progressColor}
                size="sm"
                mb={3}
              />

              <VStack align="start">
                <Badge colorScheme={project.status === "Completed" ? "green" : "yellow"}>
                  {project.status}
                </Badge>
                <Text fontSize="sm">Completion: {project.completion}%</Text>
                <Text fontSize="sm" fontWeight="bold">
                  Team: {project.assignedTeam || "Not Assigned"}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Add/Edit Project Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor} color={textColor}>
          <ModalHeader>{editingProject ? "Edit Project" : "Add Project"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} mb={4} />
            <Input placeholder="Project Description" value={description} onChange={(e) => setDescription(e.target.value)} mb={4} />
            <Select value={status} onChange={(e) => setStatus(e.target.value)} mb={4}>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Almost Done">Almost Done</option>
            </Select>
            <Select placeholder="Assign Team" value={assignedTeam} onChange={(e) => setAssignedTeam(e.target.value)}>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveProject} mr={3}>
              {editingProject ? "Update" : "Save"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Projects;
