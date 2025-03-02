"use client";

import {
  Box,
  Flex,
  Avatar,
  Text,
  VStack,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("Asim Ali");
  const [email, setEmail] = useState("mo.asim.murtaza@gmail.com");
  const [role, setRole] = useState("Software Engineer");
  const [isEditing, setIsEditing] = useState(false);

  // Dark Mode Styling
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile Updated:", { name, email, role });
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="md" shadow="md" maxW="500px" mx="auto">
      <Flex direction="column" align="center">
        <Avatar size="xl" name={name} src="/profile.jpg" mb={4} />
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          {name}
        </Text>
        <Text fontSize="md" color="gray.500">
          {email}
        </Text>
      </Flex>

      <VStack spacing={4} mt={6} align="start">
        <Box w="full">
          <Text fontSize="sm" fontWeight="bold" color={textColor} mb={1}>
            Full Name
          </Text>
          <Input
            bg={inputBg}
            borderColor={borderColor}
            value={name}
            onChange={(e) => setName(e.target.value)}
            isReadOnly={!isEditing}
          />
        </Box>

        <Box w="full">
          <Text fontSize="sm" fontWeight="bold" color={textColor} mb={1}>
            Email
          </Text>
          <Input
            bg={inputBg}
            borderColor={borderColor}
            value={email}
            isReadOnly
          />
        </Box>

        <Box w="full">
          <Text fontSize="sm" fontWeight="bold" color={textColor} mb={1}>
            Role
          </Text>
          <Input
            bg={inputBg}
            borderColor={borderColor}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            isReadOnly={!isEditing}
          />
        </Box>

        {isEditing ? (
          <Button colorScheme="blue" w="full" mt={4} onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <Button colorScheme="gray" w="full" mt={4} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default Profile;
