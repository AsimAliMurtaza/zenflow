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
  Avatar,
  AvatarGroup,
  Tag,
  TagLabel,
  TagLeftIcon,
  IconButton,
  useColorModeValue,
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
  if (!project) {
    return (
      <Box p={4} bg="red.50" borderRadius="md">
        <Text color="red.500">Invalid project data</Text>
      </Box>
    );
  }

  return (
    <Card
      onClick={onClick}
      p={6}
      borderRadius="2xl"
      shadow="lg"
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <CardBody>
        <HStack justify="space-between">
          <Heading size="lg" fontWeight="semibold">
            {project.name}
          </Heading>
          <HStack>
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
          </HStack>
        </HStack>

        <Text fontSize="md" color="gray.500" mt={2} mb={4}>
          {project.description}
        </Text>

        <Progress
          value={project.completion}
          colorScheme="blue"
          size="sm"
          borderRadius="full"
          mb={4}
        />

        <VStack align="start" spacing={3}>
          <Badge
            colorScheme={project.status === "Completed" ? "green" : "yellow"}
            borderRadius="full"
            px={3}
            py={1}
          >
            {project.status}
          </Badge>
          <Text fontSize="sm" color="gray.500">
            Completion: {project.completion}%
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Team: {project.assignedTeam?.name || "Not Assigned"}
          </Text>
          <Tag
            colorScheme={project.dueDate ? "red" : "gray"}
            borderRadius="full"
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
