"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  Badge,
  Progress,
  Spinner,
  Center,
  Icon,
  Avatar,
  useColorModeValue,
  Divider,
  Tag,
  TagLeftIcon,
  TagLabel,
} from "@chakra-ui/react";
import { AddIcon, TimeIcon } from "@chakra-ui/icons";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCheckSquare,
  FiGrid,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { GrProjects, GrRobot } from "react-icons/gr";
import { DashboardReports } from "@/types/dashboard";

const DashboardContent = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [reports, setReports] = useState<DashboardReports | null>(null);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const cardHoverBg = useColorModeValue("gray.50", "gray.750");

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    async function fetchReports() {
      try {
        const userId = session?.user?.id;
        const res = await fetch("/api/projects/reports", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchReports();
  }, [session]);

  if (isAdmin) {
    router.push("/redirect");
    return null;
  }

  if (loading) {
    return (
      <Center h="70vh">
        <Spinner color="blue.500" size="xl" thickness="3px" />
      </Center>
    );
  }

  const userName = session?.user?.name || "User";

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 8 }}>
      {/* Jira Greeting & Action Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        flexWrap="wrap"
        gap={4}
      >
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Heading size="xl" fontWeight="bold" color={textColor}>
              Your Work
            </Heading>
          </HStack>
          <Text fontSize="sm" color={subTextColor}>
            Welcome back, <span style={{ fontWeight: "bold" }}>{userName}</span>
            . Here is your team's project activity summary.
          </Text>
        </VStack>

        <HStack spacing={3}>
          <Button
            leftIcon={<GrRobot />}
            variant="outline"
            size="sm"
            borderRadius="full"
            onClick={() => router.push("/dashboard/generate-task")}
          >
            AI Generator
          </Button>
          <Button
            leftIcon={<AddIcon boxSize={2.5} />}
            colorScheme="blue"
            size="sm"
            borderRadius="full"
            px={5}
            onClick={() => router.push("/dashboard/projects")}
          >
            New Project
          </Button>
        </HStack>
      </Flex>

      {/* Metrics Row */}
      {reports && (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={5}
          mb={8}
        >
          <Card
            bg={cardBg}
            shadow="sm"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <CardBody p={5}>
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="xs"
                    color={subTextColor}
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Total Projects
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {reports.totalProjects}
                  </Text>
                </VStack>
                <Flex
                  w={10}
                  h={10}
                  bg="blue.50"
                  color="blue.500"
                  borderRadius="xl"
                  align="center"
                  justify="center"
                >
                  <Icon as={GrProjects} boxSize={5} />
                </Flex>
              </HStack>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            shadow="sm"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <CardBody p={5}>
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="xs"
                    color={subTextColor}
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    In Progress
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    {reports.inProgressProjects}
                  </Text>
                </VStack>
                <Flex
                  w={10}
                  h={10}
                  bg="blue.50"
                  color="blue.500"
                  borderRadius="xl"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiClock} boxSize={5} />
                </Flex>
              </HStack>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            shadow="sm"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <CardBody p={5}>
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="xs"
                    color={subTextColor}
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Completed
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {reports.completedProjects}
                  </Text>
                </VStack>
                <Flex
                  w={10}
                  h={10}
                  bg="green.50"
                  color="green.500"
                  borderRadius="xl"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiCheckCircle} boxSize={5} />
                </Flex>
              </HStack>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            shadow="sm"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <CardBody p={5}>
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="xs"
                    color={subTextColor}
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Overdue
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500">
                    {reports.overdueProjects?.length || 0}
                  </Text>
                </VStack>
                <Flex
                  w={10}
                  h={10}
                  bg="red.50"
                  color="red.500"
                  borderRadius="xl"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiAlertCircle} boxSize={5} />
                </Flex>
              </HStack>
            </CardBody>
          </Card>
        </Grid>
      )}

      {/* Main Grid: Projects Overview & Deadlines */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Left Column: Project Progress */}
        <VStack align="stretch" spacing={6}>
          <Card
            bg={cardBg}
            shadow="sm"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <CardBody p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <HStack spacing={2}>
                  <Icon as={FiGrid} color="blue.500" boxSize={5} />
                  <Heading size="md" fontWeight="bold">
                    Recent Projects Activity
                  </Heading>
                </HStack>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  rightIcon={<FiArrowRight />}
                  onClick={() => router.push("/dashboard/projects")}
                >
                  View All
                </Button>
              </Flex>
              <Divider mb={4} borderColor={borderColor} />

              {reports &&
              reports.projectCompletions &&
              reports.projectCompletions.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {reports.projectCompletions.map((p, idx) => (
                    <Box
                      key={idx}
                      p={3}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="semibold" fontSize="sm">
                          {p.name}
                        </Text>
                        <Badge
                          colorScheme={
                            (p.completion || 0) === 100
                              ? "green"
                              : (p.completion || 0) > 0
                                ? "blue"
                                : "gray"
                          }
                          borderRadius="full"
                        >
                          {p.completion || 0}% Completed
                        </Badge>
                      </Flex>
                      <Progress
                        value={p.completion || 0}
                        colorScheme="blue"
                        size="xs"
                        borderRadius="full"
                      />
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text
                  fontSize="sm"
                  color={subTextColor}
                  py={4}
                  textAlign="center"
                >
                  No projects available yet.
                </Text>
              )}
            </CardBody>
          </Card>
        </VStack>

        {/* Right Column: Deadlines & Overdue */}
        <VStack align="stretch" spacing={6}>
          <Card
            bg={cardBg}
            shadow="sm"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <CardBody p={6}>
              <HStack spacing={2} mb={4}>
                <Icon as={FiAlertCircle} color="amber.500" boxSize={5} />
                <Heading size="md" fontWeight="bold">
                  Upcoming Deadlines
                </Heading>
              </HStack>
              <Divider mb={4} borderColor={borderColor} />

              {reports &&
              reports.approachingDeadlineProjects &&
              reports.approachingDeadlineProjects.length > 0 ? (
                <VStack align="stretch" spacing={3}>
                  {reports.approachingDeadlineProjects.map((proj, idx) => (
                    <Flex
                      key={idx}
                      p={3}
                      borderRadius="xl"
                      bg={bgColor}
                      justify="space-between"
                      align="center"
                    >
                      <Box>
                        <Text fontWeight="semibold" fontSize="sm">
                          {proj.name}
                        </Text>
                        <Text fontSize="xs" color="red.400">
                          Due: {proj.dueDate}
                        </Text>
                      </Box>
                      <Badge colorScheme="amber" fontSize="xs">
                        Soon
                      </Badge>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Text
                  fontSize="sm"
                  color={subTextColor}
                  py={3}
                  textAlign="center"
                >
                  No upcoming deadlines.
                </Text>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Grid>
    </Box>
  );
};

export default DashboardContent;
