import { Box, HStack, Icon, List, ListItem, Text, Divider } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface ProjectListCardProps {
  title: string;
  projects: Array<{ name: string; dueDate: string }>;
  icon: IconType;
  iconColor: string;
  emptyMessage: string;
  formatDate: (date: string) => string;
}

export const ProjectListCard = ({
  title,
  projects,
  icon,
  iconColor,
  emptyMessage,
  formatDate,
}: ProjectListCardProps) => (
  <Box>
    <HStack mb={4}>
      <Icon as={icon} boxSize={5} color={iconColor} />
      <Text fontSize="lg" fontWeight="bold">
        {title}
      </Text>
    </HStack>
    <Divider mb={4} />
    {projects.length > 0 ? (
      <List spacing={3}>
        {projects.map((project, index) => (
          <ListItem key={index}>
            <HStack>
              <Icon as={icon} color={iconColor} />
              <Box>
                <Text fontWeight="medium">{project.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  Due: {formatDate(project.dueDate)}
                </Text>
              </Box>
            </HStack>
          </ListItem>
        ))}
      </List>
    ) : (
      <Text color="gray.500">{emptyMessage}</Text>
    )}
  </Box>
);