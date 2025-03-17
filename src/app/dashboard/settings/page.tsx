"use client";

import {
  Box,
  Heading,
  Text,
  Switch,
  FormControl,
  FormLabel,
  useColorMode,
  useColorModeValue,
  Divider,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [notificationPreference, setNotificationPreference] = useState("all");

  const cardBg = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const labelColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box p={6} maxW="container.lg" mx="auto">
      <Heading size="2xl" mb={6} fontWeight="semibold">
        Settings
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {/* Appearance Settings */}
        <Box p={6} borderRadius="xl" boxShadow="md" bg={cardBg}>
          <Heading size="md" mb={4} fontWeight="medium">
            Appearance
          </Heading>
          <Divider mb={4} borderColor={dividerColor} />

          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel mb="0" color={labelColor}>
              Enable Dark Mode
            </FormLabel>
            <Switch
              colorScheme="blue"
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
            />
          </FormControl>
        </Box>

        {/* Notification Settings */}
        <Box p={6} borderRadius="xl" boxShadow="md" bg={cardBg}>
          <Heading size="md" mb={4} fontWeight="medium">
            Notifications
          </Heading>
          <Divider mb={4} borderColor={dividerColor} />

          <FormControl mb={4}>
            <FormLabel color={labelColor}>Notification Preferences</FormLabel>
            <Select
              value={notificationPreference}
              onChange={(e) => setNotificationPreference(e.target.value)}
            >
              <option value="all">All Notifications</option>
              <option value="important">Important Only</option>
              <option value="none">None</option>
            </Select>
          </FormControl>
        </Box>

        {/* Account Settings */}
        <Box
          p={6}
          borderRadius="xl"
          boxShadow="md"
          bg={cardBg}
          gridColumn="1 / -1"
        >
          <Heading size="md" mb={4} fontWeight="medium">
            Account
          </Heading>
          <Divider mb={4} borderColor={dividerColor} />

          <Text color={labelColor}>
            Change password, update profile information, etc. (Coming Soon)
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Settings;
