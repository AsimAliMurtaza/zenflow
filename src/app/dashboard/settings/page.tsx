"use client";

import { Box, Heading, Text, VStack, Switch, FormControl, FormLabel } from "@chakra-ui/react";

const Settings = () => {
  return (
    <Box p={6}>
      <Heading size="xl" mb={4}>
        ⚙️ Settings
      </Heading>
      <Text fontSize="lg" mb={4}>
        Customize your preferences and application settings.
      </Text>
      <VStack spacing={4} align="start">
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Enable Dark Mode</FormLabel>
          <Switch colorScheme="blue" />
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Receive Notifications</FormLabel>
          <Switch colorScheme="green" />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default Settings;
