"use client";

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
} from "@chakra-ui/react";

// Sample project data
const projects = [
  {
    id: 1,
    name: "AI Chatbot",
    description: "A real-time AI chatbot using Next.js, FastAPI, and Llama3.",
    completion: 80,
    status: "In Progress",
  },
  {
    id: 2,
    name: "Smart Notes",
    description: "A notes app with MongoDB, Chakra UI, and Next.js.",
    completion: 100,
    status: "Completed",
  },
  {
    id: 3,
    name: "E-Commerce App",
    description: "A full-stack e-commerce application with Stripe integration.",
    completion: 60,
    status: "In Progress",
  },
  {
    id: 4,
    name: "Portfolio Website",
    description: "A modern, interactive portfolio using Next.js & Chakra UI.",
    completion: 90,
    status: "Almost Done",
  },
];

const Projects = () => {
  return (
    <Box p={6}>
      <Heading size="xl" mb={6}>
        Projects
      </Heading>
      <Text fontSize="lg" mb={4}>
        Here are your ongoing and completed projects.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {projects.map((project) => (
          <Card key={project.id} p={4} borderWidth="1px" borderRadius="lg">
            <CardBody>
              <Heading size="md" mb={2}>
                {project.name}
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={3}>
                {project.description}
              </Text>
              <Progress
                value={project.completion}
                colorScheme="blue"
                size="sm"
                mb={3}
              />
              <VStack align="start">
                <Badge
                  colorScheme={
                    project.status === "Completed" ? "green" : "yellow"
                  }
                >
                  {project.status}
                </Badge>
                <Text fontSize="sm" color="gray.600">
                  Completion: {project.completion}%
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Projects;
