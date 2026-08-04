"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Progress,
  Tabs,
  TabList,
  Tab,
  Button,
  Spinner,
  Center,
  Avatar,
  AvatarGroup,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FiGrid, FiList, FiSettings, FiPieChart, FiCalendar, FiActivity, FiDownload } from "react-icons/fi";
import { Project } from "@/types/types";
import { ProjectRoadmap } from "@/components/ProjectRoadmap";
import { AIHealthCheckModal } from "@/components/ui/AIHealthCheckModal";
import { ExportModal } from "@/components/ui/ExportModal";

const OverviewPage = dynamic(() => import("@/components/ProjectOverview"), {
  ssr: false,
});
const BoardPage = dynamic(() => import("@/components/KanbanBoard"), {
  ssr: false,
});
const BacklogPage = dynamic(
  () => import("@/components/BacklogView").then((mod) => mod.BacklogView),
  { ssr: false },
);
const SettingsPage = dynamic(() => import("@/components/ProjectSettings"), {
  ssr: false,
});

const ProjectDetailPage = () => {
  const { projectID } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const headerBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const mainBg = useColorModeValue("gray.50", "gray.900");

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectID}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      setProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectID) fetchProject();
  }, [projectID]);

  if (loading) {
    return (
      <Center h="70vh">
        <Spinner size="xl" thickness="3px" color="blue.500" />
      </Center>
    );
  }

  if (error || !project) {
    return (
      <Center h="70vh">
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.500" fontWeight="bold">
            {error || "Project not found"}
          </Text>
          <Button onClick={() => router.push("/dashboard/projects")}>
            Back to Projects
          </Button>
        </VStack>
      </Center>
    );
  }

  const allSprints = project.sprints || [];
  const allTasks = allSprints.flatMap((s) => s.tasks || []);
  const pIdStr = Array.isArray(projectID) ? projectID[0] : projectID || "";

  return (
    <Box minH="calc(100vh - 60px)" bg={mainBg}>
      {/* Jira Top Project Header Bar */}
      <Box
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        px={{ base: 4, md: 8 }}
        pt={5}
        shadow="xs"
      >
        {/* Breadcrumbs */}
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
          fontSize="xs"
          color={textColor}
          mb={3}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage fontWeight="bold">
            <BreadcrumbLink>{project.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Project Meta Bar */}
        <Flex
          justify="space-between"
          align="center"
          flexWrap="wrap"
          pb={4}
          gap={4}
        >
          <HStack spacing={4}>
            <Avatar
              name={project.name}
              size="md"
              bg="blue.600"
              color="white"
              borderRadius="xl"
            />
            <VStack align="start" spacing={1}>
              <HStack spacing={3}>
                <Heading size="lg" fontWeight="bold">
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
                  px={3}
                  py={0.5}
                  fontSize="xs"
                >
                  {project.status}
                </Badge>
              </HStack>
              <Text fontSize="xs" color={textColor} maxW="600px" noOfLines={1}>
                {project.description || "Software Project"}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={4} align="center" flexWrap="wrap">
            {/* Completion */}
            <VStack align="start" spacing={0.5}>
              <Text fontSize="xs" color={textColor}>
                Completion
              </Text>
              <HStack spacing={2} w="120px">
                <Progress
                  value={project.completion || 0}
                  size="xs"
                  colorScheme="blue"
                  borderRadius="full"
                  flex={1}
                />
                <Text fontSize="xs" fontWeight="bold">
                  {project.completion || 0}%
                </Text>
              </HStack>
            </VStack>

            {/* Team */}
            {project.assignedTeam && (
              <VStack align="start" spacing={0.5}>
                <Text fontSize="xs" color={textColor}>
                  Team
                </Text>
                <HStack spacing={2}>
                  <Badge colorScheme="purple" borderRadius="md" px={2}>
                    {project.assignedTeam.name}
                  </Badge>
                  {project.assignedTeam.members && (
                    <AvatarGroup size="xs" max={3}>
                      {project.assignedTeam.members.map((m) => (
                        <Avatar
                          key={m.id}
                          name={m.user?.name || m.user?.email || ""}
                        />
                      ))}
                    </AvatarGroup>
                  )}
                </HStack>
              </VStack>
            )}

            {/* AI Risk Analysis & Export Action Buttons */}
            <HStack spacing={2}>
              <Button
                leftIcon={<FiActivity />}
                colorScheme="purple"
                size="sm"
                borderRadius="full"
                px={4}
                onClick={() => setIsHealthCheckOpen(true)}
              >
                AI Health Check
              </Button>
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                colorScheme="blue"
                size="sm"
                borderRadius="full"
                px={4}
                onClick={() => setIsExportOpen(true)}
              >
                Export
              </Button>
            </HStack>
          </HStack>
        </Flex>

        {/* Jira-style Horizontal Tab Header */}
        <Tabs
          index={activeTab}
          onChange={setActiveTab}
          colorScheme="blue"
          variant="line"
        >
          <TabList borderBottom="none">
            <Tab fontWeight="bold" fontSize="sm">
              <Icon as={FiGrid} mr={2} /> Board
            </Tab>
            <Tab fontWeight="bold" fontSize="sm">
              <Icon as={FiList} mr={2} /> Backlog & Sprints
            </Tab>
            <Tab fontWeight="bold" fontSize="sm">
              <Icon as={FiCalendar} mr={2} /> Roadmap
            </Tab>
            <Tab fontWeight="bold" fontSize="sm">
              <Icon as={FiPieChart} mr={2} /> Summary
            </Tab>
            <Tab fontWeight="bold" fontSize="sm">
              <Icon as={FiSettings} mr={2} /> Settings
            </Tab>
          </TabList>
        </Tabs>
      </Box>

      {/* Main Tab Content */}
      <Container maxW="100vw" p={{ base: 4, md: 6 }}>
        {activeTab === 0 && <BoardPage onRefreshProject={fetchProject} />}
        {activeTab === 1 && (
          <BacklogPage
            project={project}
            sprints={allSprints}
            tasks={allTasks}
            onRefresh={fetchProject}
            onSelectTask={() => {}}
            onOpenCreateTask={() => setActiveTab(0)}
            onOpenCreateSprint={() => setActiveTab(3)}
          />
        )}
        {activeTab === 2 && <ProjectRoadmap projectId={pIdStr} />}
        {activeTab === 3 && <OverviewPage project={project} />}
        {activeTab === 4 && <SettingsPage projectID={pIdStr} />}
      </Container>

      {/* AI Health Check & Export Modals */}
      <AIHealthCheckModal
        isOpen={isHealthCheckOpen}
        onClose={() => setIsHealthCheckOpen(false)}
        projectId={pIdStr}
        projectName={project.name}
      />
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectId={pIdStr}
        projectName={project.name}
      />
    </Box>
  );
};

export default ProjectDetailPage;
