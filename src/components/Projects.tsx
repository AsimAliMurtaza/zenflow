// components/Projects.tsx
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
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ProjectCard from "./ui/ProjectCard";
import ProjectModal from "./ui/ProjectModal";
import { Project, Team } from "@/types/types";

type ProjectsProps = {
  projects: Project[];
  teams: Team[];
};

const Projects = ({ projects: initialProjects, teams }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [assignedTeam, setAssignedTeam] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const router = useRouter();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // Open modal for adding or editing
  const openModal = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setDescription(project.description);
      setStatus(project.status);
      setAssignedTeam(project.assignedTeam._id);
    } else {
      setEditingProject(null);
      setProjectName("");
      setDescription("");
      setStatus("In Progress");
      setAssignedTeam("");
    }
    onOpen();
  };

  // Add or Update Project
  const handleSaveProject = async () => {
    if (!projectName.trim() || !description.trim()) {
      toast({ title: "Name and description are required.", status: "warning" });
      return;
    }

    const projectData = {
      name: projectName,
      description: description,
      status: status,
      assignedTeam: assignedTeam,
      dueDate: dueDate,
    };

    const url = editingProject
      ? `/api/projects?id=${editingProject._id}`
      : "/api/projects";
    const method = editingProject ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (response.ok) {
      const updatedProject: Project = await response.json();
      if (editingProject) {
        setProjects((prevProjects: Project[]) =>
          prevProjects.map((proj) =>
            proj._id === editingProject._id ? updatedProject : proj
          )
        );
        toast({ title: "Project updated!", status: "success" });
      } else {
        setProjects([...projects, updatedProject]);
        toast({ title: "Project added!", status: "success" });
      }
      onClose();
    } else {
      toast({ title: "Failed to save project.", status: "error" });
    }
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
      toast({ title: "Project deleted.", status: "error" });
    }
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
      <Text
        fontSize="lg"
        mb={8}
        color={useColorModeValue("gray.600", "gray.300")}
      >
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
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={() => openModal(project)}
            onDelete={() => removeProject(project._id)}
            onClick={() => handleProjectClick(project._id)}
          />
        ))}
      </SimpleGrid>

      {/* Add/Edit Project Modal */}
      <ProjectModal
        isOpen={isOpen}
        onClose={onClose}
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
