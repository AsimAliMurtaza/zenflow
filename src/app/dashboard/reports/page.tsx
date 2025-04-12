"use client";

import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Spinner,
  VStack,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface Project {
  name: string;
  dueDate: string;
  completion?: number;
}

interface ProjectReportsData {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  approachingDeadlineProjects: Project[];
  overdueProjects: Project[];
  projectCompletions: Project[];
}

function ProjectReports() {
  const [reports, setReports] = useState<ProjectReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("/api/projects/reports");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProjectReportsData = await response.json();
        setReports(data);
      } catch (error) {
        const err = error as Error;
        toast({
          title: "Error loading project reports",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [toast]);

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading project reports...</Text>
      </Box>
    );
  }

  if (!reports) {
    return (
      <Box p={8} textAlign="center">
        <Text>No project reports available.</Text>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <Box p={8} maxW="4xl" mx="auto">
      <Heading size="xl" mb={4}>
        Project Reports
      </Heading>

      <VStack align="start" spacing={4} mb={6}>
        <Text>
          <strong>Total Projects:</strong> {reports.totalProjects}
        </Text>
        <Text>
          <strong>Completed Projects:</strong> {reports.completedProjects}
        </Text>
        <Text>
          <strong>In Progress Projects:</strong> {reports.inProgressProjects}
        </Text>
      </VStack>

      <Divider my={4} />

      <Box mb={6}>
        <Heading size="md" mb={2}>
          Projects Approaching Deadline (Next 7 Days)
        </Heading>
        {reports.approachingDeadlineProjects.length > 0 ? (
          <List spacing={2}>
            {reports.approachingDeadlineProjects.map((project) => (
              <ListItem key={project.name}>
                <Text>
                  {project.name} - Due Date: {formatDate(project.dueDate)}
                </Text>
              </ListItem>
            ))}
          </List>
        ) : (
          <Text>No projects approaching deadline in the next 7 days.</Text>
        )}
      </Box>

      <Divider my={4} />

      <Box mb={6}>
        <Heading size="md" mb={2}>
          Overdue Projects
        </Heading>
        {reports.overdueProjects.length > 0 ? (
          <List spacing={2}>
            {reports.overdueProjects.map((project) => (
              <ListItem key={project.name}>
                <Text>
                  {project.name} - Due Date: {formatDate(project.dueDate)}
                </Text>
              </ListItem>
            ))}
          </List>
        ) : (
          <Text>No overdue projects.</Text>
        )}
      </Box>

      <Divider my={4} />

      <Box>
        <Heading size="md" mb={2}>
          Project Completion Percentages
        </Heading>
        {reports.projectCompletions.length > 0 ? (
          <List spacing={2}>
            {reports.projectCompletions.map((project) => (
              <ListItem key={project.name}>
                <Text>
                  {project.name}: {project.completion}%
                </Text>
              </ListItem>
            ))}
          </List>
        ) : (
          <Text>No project completion data available.</Text>
        )}
      </Box>
    </Box>
  );
}

export default ProjectReports;
