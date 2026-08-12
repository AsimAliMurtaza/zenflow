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
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Select,
  Badge,
  VStack,
  Card,
  CardBody,
  Progress,
  Tag,
  TagLeftIcon,
  TagLabel,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon, TimeIcon } from "@chakra-ui/icons";
import { FiGrid, FiList } from "react-icons/fi";
import ProjectCard from "./ui/ProjectCard";
import ProjectModal from "./ui/ProjectModal";
import { Project, Team } from "@/types/types";
import { useSession } from "next-auth/react";

type ProjectsProps = {
  projects: Project[];
  teams: Team[];
};

const Projects = ({ projects: initialProjects, teams }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const { data: session } = useSession();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("In Progress");
  const [assignedTeam, setAssignedTeam] = useState<string>("");
  const [dueDate, setDueDate] = useState("");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const filterBg = useColorModeValue("gray.50", "gray.800");

  const openModal = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setProjectName(project.name);
      setDescription(project.description);
      setStatus(project.status);
      setAssignedTeam(project.assignedTeamId ?? "");
      setDueDate(project.dueDate ?? "");
    } else {
      setEditingProject(null);
      setProjectName("");
      setDescription("");
      setStatus("Not Started");
      setAssignedTeam("");
      setDueDate("");
    }
    onOpen();
  };

  const createProject = async (projectData: Omit<Project, "id">) => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (response.ok) {
      const newProject: Project = await response.json();
      setProjects([newProject, ...projects]);
      toast({
        title: "Project created successfully!",
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

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    const payload = {
      ...projectData,
      assignedTeamId: assignedTeam ? assignedTeam : null,
    };

    const response = await fetch(`/api/projects?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedProject: Project = await response.json();
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? updatedProject : proj))
      );
      toast({
        title: "Project updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to update project.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
      assignedTeamId: assignedTeam || null,
      dueDate: dueDate,
      createdById: session?.user?.id,
      completion: 0,
    };

    if (editingProject) {
      projectData.completion = editingProject.completion ?? 0;
      await updateProject(editingProject.id, projectData);
    } else {
      await createProject(projectData);
    }

    onClose();
  };

  const removeProject = async (id: string) => {
    const response = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setProjects(projects.filter((proj) => proj.id !== id));
      toast({
        title: "Project deleted.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
  };

  // Filtered projects
  const filteredProjects = projects.filter((project) => {
    if (
      searchQuery &&
      !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !project.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "All" && project.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <Box p={{ base: 4, md: 8 }} bg={bgColor} color={textColor} minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Box>
          <Heading size="xl" fontWeight="bold" mb={1}>
            Projects
          </Heading>
          <Text fontSize="md" color={subTextColor}>
            Manage, track, and collaborate on software projects.
          </Text>
        </Box>

        <Button
          leftIcon={<AddIcon />}
          onClick={() => openModal()}
          size="md"
          borderRadius="full"
          colorScheme="blue"
          px={6}
        >
          New Project
        </Button>
      </Flex>

      {/* Control Bar: Search, Status Filter & View Toggle */}
      <Flex
        p={4}
        bg={filterBg}
        borderRadius="2xl"
        mb={8}
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={4}
      >
        <HStack spacing={4} flex={1} minW="280px">
          <InputGroup size="sm" maxW="320px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="xl"
              bg={bgColor}
            />
          </InputGroup>

          <Select
            size="sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            w="160px"
            borderRadius="xl"
            bg={bgColor}
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </HStack>

        <HStack spacing={2}>
          <IconButton
            aria-label="Grid View"
            icon={<FiGrid />}
            size="sm"
            variant={viewMode === "grid" ? "solid" : "ghost"}
            colorScheme={viewMode === "grid" ? "blue" : "gray"}
            onClick={() => setViewMode("grid")}
            borderRadius="lg"
          />
          <IconButton
            aria-label="List View"
            icon={<FiList />}
            size="sm"
            variant={viewMode === "list" ? "solid" : "ghost"}
            colorScheme={viewMode === "list" ? "blue" : "gray"}
            onClick={() => setViewMode("list")}
            borderRadius="lg"
          />
        </HStack>
      </Flex>

      {/* Projects Presentation */}
      {filteredProjects.length === 0 ? (
        <Card p={10} textAlign="center" borderRadius="2xl" bg={filterBg}>
          <Text fontSize="lg" fontWeight="semibold" color={subTextColor}>
            No projects found.
          </Text>
          <Text fontSize="sm" color={subTextColor} mt={1}>
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your search query or status filter."
              : "Get started by creating your first project!"}
          </Text>
        </Card>
      ) : viewMode === "grid" ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => openModal(project)}
              onDelete={() => removeProject(project.id)}
              onClick={() => handleProjectClick(project.id)}
              assignedTeam={project.assignedTeamId ?? ""}
              teams={teams}
            />
          ))}
        </SimpleGrid>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              p={4}
              borderRadius="xl"
              bg={filterBg}
              cursor="pointer"
              _hover={{ shadow: "md" }}
              onClick={() => handleProjectClick(project.id)}
            >
              <CardBody p={0}>
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                  <Box flex={1}>
                    <HStack spacing={3} mb={1}>
                      <Heading size="md" fontWeight="bold">
                        {project.name}
                      </Heading>
                      <Badge
                        colorScheme={
                          project.status === "Completed"
                            ? "green"
                            : project.status === "In Progress"
                            ? "blue"
                            : "gray"
                        }
                        borderRadius="full"
                        px={2.5}
                      >
                        {project.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={subTextColor} noOfLines={1}>
                      {project.description}
                    </Text>
                  </Box>

                  <HStack spacing={6}>
                    <Box w="140px">
                      <Flex justify="space-between" fontSize="xs" color={subTextColor} mb={1}>
                        <Text>Completion</Text>
                        <Text fontWeight="bold">{project.completion || 0}%</Text>
                      </Flex>
                      <Progress
                        value={project.completion || 0}
                        size="xs"
                        colorScheme="blue"
                        borderRadius="full"
                      />
                    </Box>

                    {project.dueDate && (
                      <Tag size="sm" colorScheme="red" borderRadius="full">
                        <TagLeftIcon as={TimeIcon} />
                        <TagLabel>{project.dueDate}</TagLabel>
                      </Tag>
                    )}
                  </HStack>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      {/* Add/Edit Project Modal */}
      <ProjectModal
        isOpen={isOpen}
        onClose={onClose}
        projectName={projectName}
        description={description}
        assignedTeam={assignedTeam}
        dueDate={dueDate}
        teams={teams}
        onProjectNameChange={setProjectName}
        onDescriptionChange={setDescription}
        onAssignedTeamChange={setAssignedTeam}
        onDueDateChange={setDueDate}
        onSave={handleSaveProject}
        isEditing={!!editingProject}
      />
    </Box>
  );
};

export default Projects;
