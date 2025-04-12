import { Box, Badge, Divider, HStack, Progress, Text, VStack } from "@chakra-ui/react";

interface TaskOverviewCardProps {
  report: {
    projectId: string;
    projectName: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  };
}

export const TaskOverviewCard = ({ report }: TaskOverviewCardProps) => (
  <Box p={5} borderWidth="1px" borderRadius="xl">
    <Text fontSize="md" fontWeight="bold" mb={3}>
      {report.projectName}
    </Text>
    <Divider mb={3} />
    <VStack align="start" spacing={2}>
      <HStack justify="space-between" w="full">
        <Text fontSize="sm">Total Tasks:</Text>
        <Badge colorScheme="blue">{report.totalTasks}</Badge>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text fontSize="sm">Completed:</Text>
        <Badge colorScheme="green">{report.completedTasks}</Badge>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text fontSize="sm">Pending:</Text>
        <Badge colorScheme="yellow">{report.pendingTasks}</Badge>
      </HStack>
      <Progress
        value={(report.completedTasks / report.totalTasks) * 100}
        colorScheme="green"
        size="sm"
        borderRadius="full"
        mt={2}
      />
    </VStack>
  </Box>
);