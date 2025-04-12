"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useDisclosure,
  useToast,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ProjectCard from "./ui/ProjectCard";
import ProjectModal from "./ui/ProjectModal";
import { Project, Team, TaskStatus } from "@/types/types";

type ProjectsProps = {
  projects: Project[];
  teams: Team[];
};

const Projects = ({ projects: initialProjects, teams }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState("");

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("In Progress");
  const [assignedTeam, setAssignedTeam] = useState<Team | null>(null);
  const [dueDate, setDueDate] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const {
    isOpen: isProjectModalOpen,
    onClose: onProjectModalClose,
  } = useDisclosure();

  console.log(isOpen);

  // Open modal for adding or editing
  const openModal = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setDescription(project.description);
      setStatus(project.status);
      setAssignedTeam(project.assignedTeam);
      setDueDate(project.dueDate);
    } else {
      setEditingProject(null);
      setProjectName("");
      setDescription("");
      setStatus("In Progress");
      setAssignedTeam(null);
      setDueDate("");
    }
    onOpen();
  };

  // Create a new project
  const createProject = async (projectData: Omit<Project, "_id">) => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (response.ok) {
      const newProject: Project = await response.json();
      setProjects([...projects, newProject]);
      toast({
        title: "Project added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to create project.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Update an existing project
  const updateProject = async (id: string, projectData: Partial<Project>) => {
    /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    const x: any = { ...projectData };
    /*eslint-enable-next-line @typescript-eslint/no-explicit-any*/
    x.assignedTeam = assignedTeam?._id;
    const response = await fetch(`/api/projects?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(x),
    });

    if (response.ok) {
      const updatedProject: Project = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((proj) => (proj._id === id ? updatedProject : proj))
      );
      toast({
        title: "Project updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const errorData = await response.json();
      console.error("Failed to update project:", errorData);
      toast({
        title: "Failed to update project.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle saving a project (create or update)
  const handleSaveProject = async () => {
    if (!projectName.trim() || !description.trim()) {
      toast({
        title: "Name and description are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const projectData = {
      name: projectName,
      description: description,
      status: status,
      assignedTeam: assignedTeam,
      dueDate: dueDate,
      completion: 0,
      tasks: [],
      sprints: [],
    };

    if (editingProject) {
      // Update existing project
      await updateProject(editingProject._id, projectData);
    } else {
      // Create new project
      await createProject(projectData);
    }

    onClose();
  };

  // Remove Project
  const removeProject = async (id: string) => {
    const response = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setProjects(projects.filter((proj) => proj._id !== id));
      toast({
        title: "Project deleted.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle Project Click
  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
  };
  console.log("detected: ", projects);
  return (
    <Box p={8} bg={bgColor} color={textColor} minH="100vh" position="relative">
      {/* Main Content */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="2xl" fontWeight="bold" mb={2}>
            Projects Management
          </Heading>
          <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.300")}>
            Manage your projects, track progress, and assign teams.
          </Text>
        </Box>
        <Button
          leftIcon={<AddIcon />}
          onClick={() => openModal()}
          size="lg"
          borderRadius="full"
          colorScheme="blue"
          _hover={{ transform: "scale(1.05)" }}
          _active={{ transform: "scale(0.95)" }}
          transition="all 0.2s"
        >
          Add Project
        </Button>
      </Flex>

      {/* Projects Grid */}
      {Array.isArray(projects) && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={() => openModal(project)}
              onDelete={() => removeProject(project._id)}
              onClick={() => handleProjectClick(project._id)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={onProjectModalClose}
        projectName={projectName}
        description={description}
        status={status}
        assignedTeam={assignedTeam}
        dueDate={dueDate}
        teams={teams}
        onProjectNameChange={setProjectName}
        onDescriptionChange={setDescription}
        onStatusChange={setStatus}
        onAssignedTeamChange={setAssignedTeam}
        onDueDateChange={setDueDate}
        onSave={handleSaveProject}
        isEditing={!!editingProject}
      />
    </Box>
  );
};

export default Projects;
