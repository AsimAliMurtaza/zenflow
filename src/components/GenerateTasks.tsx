"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Project, Sprint } from "@/types/types";

interface GenerateTasksProps {
  projects: Project[];
}

const GenerateTasks: React.FC<GenerateTasksProps> = ({ projects }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const selectedProject = projects.find((p) => p._id === selectedProjectId);
  const availableSprints = selectedProject?.sprints || [];

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const descColor = useColorModeValue("gray.600", "gray.400");

  const handleGenerateTasks = async () => {
    if (!prompt.trim() || !selectedProjectId || !selectedSprintId) {
      toast({
        title: "Missing Information",
        description: "Please enter a prompt and select a project.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          projectId: selectedProjectId,
          sprintId: selectedSprintId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Tasks Generated",
          description: `${data.tasks.length} tasks have been added to the project.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setPrompt("");
        setSelectedProjectId("");
      } else {
        const errorData = await response.json();
        toast({
          title: "Generation Failed",
          description:
            errorData?.message || "An error occurred while generating tasks.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Frontend error generating tasks:", error);
      toast({
        title: "Generation Error",
        description: "An unexpected error occurred during task generation.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleGenerateTasks();
      }}
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      w="full"
      mx="auto"
      boxShadow="lg"
    >
      <Stack spacing={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={1}>
            Generate Tasks with ZenFlow AI
          </Text>
          <Text fontSize="sm" color={descColor} mb={1}>
            Powered by Gemini
          </Text>
          <Text fontSize="sm" color={descColor}>
            Describe your goal, and ZenFlow AI will break it down into
            actionable tasks.
          </Text>
        </Box>

        <Divider />

        <FormControl id="prompt" isRequired>
          <FormLabel color={labelColor}>Prompt</FormLabel>
          <Input
            placeholder="e.g. Design onboarding flow for new users"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            bg={inputBg}
            borderRadius="md"
            _focusVisible={{ borderColor: "blue.500", boxShadow: "sm" }}
          />
        </FormControl>

        <FormControl id="project" isRequired>
          <FormLabel color={labelColor}>Assign to Project</FormLabel>
          <Select
            placeholder="Select a project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            bg={inputBg}
            borderRadius="md"
            _focusVisible={{ borderColor: "blue.500", boxShadow: "sm" }}
          >
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="sprint" isRequired>
          <FormLabel color={labelColor}>Select Sprint</FormLabel>
          <Select
            placeholder="Select a Sprint"
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            bg={inputBg}
            borderRadius="md"
            _focusVisible={{ borderColor: "blue.500", boxShadow: "sm" }}
          >
            {availableSprints.map((sprint: Sprint) => (
              <option key={sprint._id} value={sprint._id}>
                {sprint.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          isLoading={loading}
          loadingText="Generating..."
          _hover={{ opacity: 0.95 }}
        >
          Generate Tasks
        </Button>

        {loading && (
          <Center pt={2}>
            <CircularProgress isIndeterminate color="blue.400" size="40px" />
          </Center>
        )}
      </Stack>
    </Box>
  );
};

export default GenerateTasks;
