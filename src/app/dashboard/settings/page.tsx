"use client";

import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Switch, 
  FormControl, 
  FormLabel, 
  useColorMode 
} from "@chakra-ui/react";

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // 🌙 Toggle Dark Mode

  return (
    <Box p={6}>
      <Heading size="xl" mb={4}>
        ⚙️ Settings
      </Heading>
      <Text fontSize="lg" mb={4}>
        Customize your preferences and application settings.
      </Text>
      <VStack spacing={4} align="start">
        {/* Dark Mode Toggle */}
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Enable Dark Mode</FormLabel>
          <Switch 
            colorScheme="blue" 
            isChecked={colorMode === "dark"} // Sync switch with theme
            onChange={toggleColorMode} // Toggle dark mode
          />
        </FormControl>

        {/* Notifications Toggle */}
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Receive Notifications</FormLabel>
          <Switch colorScheme="green" />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default Settings;
