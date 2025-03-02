"use client";

import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";

const Reports = () => {
  return (
    <Box p={6}>
      <Heading size="xl" mb={4}>
        📈 Reports
      </Heading>
      <Text fontSize="lg" mb={4}>
        View analytics and track your progress over time.
      </Text>
      <VStack spacing={3} align="start">
        <Button colorScheme="green">Generate Report</Button>
        <Button colorScheme="gray">View Previous Reports</Button>
      </VStack>
    </Box>
  );
};

export default Reports;
