"use client";

import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";

const Teams = () => {
  return (
    <Box p={6}>
      <Heading size="xl" mb={4}>
        👥 Teams
      </Heading>
      <Text fontSize="lg" mb={4}>
        Manage your teams, add members, and assign roles.
      </Text>
      <VStack spacing={3} align="start">
        <Button colorScheme="blue">Create New Team</Button>
        <Button colorScheme="gray">View Existing Teams</Button>
      </VStack>
    </Box>
  );
};

export default Teams;
