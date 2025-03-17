// components/ui/ProjectCard.tsx
import {
  Box,
  Heading,
  Text,
  Progress,
  Card,
  CardBody,
  VStack,
  Badge,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  IconButton,
  useColorModeValue,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, TimeIcon } from "@chakra-ui/icons";
import { Project } from "@/types/types";

type ProjectCardProps = {
  project: Project | null;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
};

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onClick,
}: ProjectCardProps) => {
  const cardHoverBG = useColorModeValue("gray.50", "gray.700");
  const cardBG = useColorModeValue("white", "gray.800");
  const tagColor = useColorModeValue("gray.100", "gray.700");
  if (!project) {
    return (
      <Box p={4} bg="red.50" borderRadius="xl" boxShadow="md">
        <Text color="red.500">Invalid project data</Text>
      </Box>
    );
  }

  return (
    <Card
      onClick={onClick}
      p={6}
      borderRadius="2xl"
      shadow="xl"
      bg={cardBG}
      transition="transform 0.2s, box-shadow 0.2s, background-color 0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "2xl",
        bg: { cardHoverBG }, // Subtle hover background
      }}
      role="group" // Improve screen reader experience
    >
      <CardBody>
        <Flex align="center" mb={4}>
          <Heading size="lg" fontWeight="semibold" flex="1">
            {project.name}
          </Heading>
          <HStack spacing={2}>
            <Tooltip label="Edit Project">
              <IconButton
                aria-label="Edit project"
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              />
            </Tooltip>
            <Tooltip label="Delete Project">
              <IconButton
                aria-label="Delete project"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              />
            </Tooltip>
          </HStack>
        </Flex>

        <Text fontSize="md" color="gray.600" mb={4}>
          {project.description}
        </Text>

        <Progress
          value={project.completion}
          colorScheme="blue"
          size="sm"
          borderRadius="full"
          mb={4}
          hasStripe
          isAnimated
          sx={{
            "--progress-bar-bg": "linear-gradient(to right, #63B3ED, #3182CE)", // Subtle gradient
          }}
        />

        <VStack align="start" spacing={3}>
          <Badge
            colorScheme={project.status === "Completed" ? "green" : "yellow"}
            borderRadius="full"
            px={3}
            py={1}
            variant="solid"
          >
            {project.status}
          </Badge>
          <Text fontSize="sm" color="gray.600">
            Completion: {project.completion}%
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            Team: {project.assignedTeam?.name || "Not Assigned"}
          </Text>
          <Tag
            colorScheme={project.dueDate ? "red" : "gray"}
            borderRadius="full"
            variant="subtle"
            bg={tagColor} // added background
          >
            <TagLeftIcon as={TimeIcon} />
            <TagLabel>Due: {project.dueDate || "No due date"}</TagLabel>
          </Tag>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ProjectCard;
