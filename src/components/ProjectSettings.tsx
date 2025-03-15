"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const SettingsPage = ({ projectID }: { projectID: string }) => {
  return (
    <Box>
      <Heading size="xl" mb={6}>
        Project Settings
      </Heading>
      <VStack align="start" spacing={4}>
        <Text>Configure project settings here.</Text>
      </VStack>
    </Box>
  );
};

export default SettingsPage;
