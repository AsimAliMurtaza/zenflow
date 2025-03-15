// components/ProjectCard.tsx
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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, TimeIcon } from "@chakra-ui/icons";

type ProjectCardProps = {
  project: any; // Replace `any` with a proper type (see below)
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
  return (
    <Card
      onClick={onClick}
      p={6}
      borderRadius="2xl"
      shadow="lg"
      bg="gray.50"
      _hover={{ transform: "scale(1.02)", transition: "transform 0.2s" }}
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
          <AvatarGroup size="sm" max={3}>
            {project.teamMembers?.map((member: string, index: number) => (
              <Avatar key={index} name={member} />
            ))}
          </AvatarGroup>
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
