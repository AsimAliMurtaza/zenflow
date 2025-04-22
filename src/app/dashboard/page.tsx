"use client";

import {
  Box,
  Flex,
  Text,
  Grid,
  VStack,
  useColorModeValue,
  Card,
  CardBody,
  HStack,
  Divider,
  Progress,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FiHome,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiList,
  FiAlertTriangle,
  FiPercent,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { format } from "date-fns";
import { StatsCard } from "@/components/ui/StatsCard";
import { ProjectListCard } from "@/components/ui/ProjectListCard";
import { TaskOverviewCard } from "@/components/ui/TaskOverviewCard";
import { DashboardReports, TaskReport } from "@/types/dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardContent = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const statCardHover = useColorModeValue("gray.100", "gray.700");
  const toast = useToast();
  const router = useRouter();

  const { data: session } = useSession();
  const [reports, setReports] = useState<DashboardReports | null>(null);
  const [taskReports, setTaskReports] = useState<TaskReport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    async function fetchAllReports() {
      try {
        setLoading(true);

        const userId = session?.user?.id;

        // 📊 Fetch project reports
        const projectResponse = await fetch("/api/projects/reports", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
            cache: "no-store",
          },
        });

        if (!projectResponse.ok) {
          throw new Error(
            `Failed to fetch project reports: ${projectResponse.status}`
          );
        }

        const projectData: DashboardReports = await projectResponse.json();

        // ✅ Fetch task reports with same Bearer
        const taskResponse = await fetch("/api/tasks/reports", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
            cache: "no-store",
          },
        });

        if (!taskResponse.ok) {
          throw new Error(
            `Failed to fetch task reports: ${taskResponse.status}`
          );
        }

        const taskData: TaskReport[] = await taskResponse.json();

        setReports(projectData);
        setTaskReports(taskData);
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        toast({
          title: "Error loading reports",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAllReports();
  }, [toast, session, router]);

  if (isAdmin) {
    router.push("/redirect");
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const paginatedTaskReports = taskReports?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = taskReports
    ? Math.ceil(taskReports.length / itemsPerPage)
    : 0;

  if (loading) {
    return (
      <Flex
        flex="1"
        flexDir="column"
        p={8}
        bg={bgColor}
        minH="100vh"
        justify="center"
        align="center"
      >
        <Spinner colorScheme="blue" size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        flex="1"
        flexDir="column"
        p={8}
        bg={bgColor}
        minH="100vh"
        justify="center"
        align="center"
      >
        <Alert status="error" maxW="md">
          <AlertIcon />
          Error loading dashboard: {error}
        </Alert>
      </Flex>
    );
  }

  if (!reports) {
    return null;
  }

  return (
    <Flex flex="1" flexDir="column" p={8} bg={bgColor} minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
        Project Dashboard
      </Text>

      {/* Stats Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        mb={8}
      >
        <Card
          bg={cardBg}
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          transition="background-color 0.3s ease"
          _hover={{ bg: statCardHover }}
        >
          <CardBody>
            <StatsCard
              title="Total Projects"
              count={reports.totalProjects}
              icon={FiHome}
              color="blue.500"
              iconColor={iconColor}
            />
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          transition="background-color 0.3s ease"
          _hover={{ bg: statCardHover }}
        >
          <CardBody>
            <StatsCard
              title="Completed Projects"
              count={reports.completedProjects}
              icon={FiCheckCircle}
              color="green.500"
              iconColor={iconColor}
            />
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          transition="background-color 0.3s ease"
          _hover={{ bg: statCardHover }}
        >
          <CardBody>
            <StatsCard
              title="In Progress Projects"
              count={reports.inProgressProjects}
              icon={FiClock}
              color="purple.500"
              iconColor={iconColor}
            />
          </CardBody>
        </Card>
      </Grid>

      {/* Project Reports Section */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8}>
        <Card
          bg={cardBg}
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          transition="background-color 0.3s ease"
          _hover={{ bg: statCardHover }}
        >
          <CardBody>
            <ProjectListCard
              title="Upcoming Deadlines"
              projects={reports.approachingDeadlineProjects}
              icon={FiAlertCircle}
              iconColor="yellow.500"
              emptyMessage="No projects approaching deadline"
              formatDate={formatDate}
            />
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          transition="background-color 0.3s ease"
          _hover={{ bg: statCardHover }}
        >
          <CardBody>
            <ProjectListCard
              title="Overdue Projects"
              projects={reports.overdueProjects}
              icon={FiAlertTriangle}
              iconColor="red.500"
              emptyMessage="No overdue projects"
              formatDate={formatDate}
            />
          </CardBody>
        </Card>
      </Grid>

      {/* Task Reports Section */}
      <Card
        bg={cardBg}
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        p={6}
        mb={8}
        transition="background-color 0.3s ease"
        _hover={{ bg: statCardHover }}
      >
        <CardBody>
          <HStack mb={4} justify="space-between">
            <HStack>
              <Icon as={FiList} boxSize={5} color="blue.500" />
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Task Overview by Project
              </Text>
            </HStack>
            {totalPages > 1 && (
              <ButtonGroup size="sm" isAttached variant="outline">
                <Button
                  leftIcon={<FiChevronLeft />}
                  isDisabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </Button>
                <Button
                  rightIcon={<FiChevronRight />}
                  isDisabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </ButtonGroup>
            )}
          </HStack>
          <Divider mb={6} />
          {paginatedTaskReports && paginatedTaskReports.length > 0 ? (
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              {paginatedTaskReports.map((report) => (
                <TaskOverviewCard key={report.projectId} report={report} />
              ))}
            </Grid>
          ) : (
            <Text color="gray.500">No task reports available</Text>
          )}
        </CardBody>
      </Card>

      {/* Project Completion */}
      <Card
        bg={cardBg}
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        p={6}
        transition="background-color 0.3s ease"
        _hover={{ bg: statCardHover }}
      >
        <CardBody>
          <HStack mb={4}>
            <Icon as={FiPercent} boxSize={5} color="purple.500" />
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Project Completion
            </Text>
          </HStack>
          <Divider mb={6} />
          {reports.projectCompletions.length > 0 ? (
            <VStack spacing={4}>
              {reports.projectCompletions.map((project, index) => (
                <Box key={index} w="full">
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="medium">{project.name}</Text>
                    <Badge
                      colorScheme={
                        (project.completion ?? 0) > 70
                          ? "green"
                          : (project.completion ?? 0) > 40
                          ? "yellow"
                          : "red"
                      }
                    >
                      {project.completion}%
                    </Badge>
                  </HStack>
                  <Progress
                    value={project.completion}
                    colorScheme="blue"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">No completion data available</Text>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
};

export default DashboardContent;
