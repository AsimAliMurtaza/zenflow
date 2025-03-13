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
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User"); // Default role
  const [isEditing, setIsEditing] = useState(false);

  // Dark Mode Styling (ZenFlow Theme)
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const buttonBg = useColorModeValue("teal.500", "teal.400");
  const buttonHoverBg = useColorModeValue("teal.600", "teal.500");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "Unknown User");
      setEmail(session.user.email || "No Email");
    }
  }, [session]);

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile Updated:", { name, email, role });
  };

  if (status === "loading") {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="md"
      shadow="lg"
      maxW="500px"
      mx="auto"
      border="1px solid"
      borderColor={borderColor}
    >
      <Flex direction="column" align="center">
        <Avatar size="xl" name={name} src={session?.user?.image || "/profile.jpg"} mb={4} />
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
          <Button bg={buttonBg} color="white" w="full" mt={4} onClick={handleSave} _hover={{ bg: buttonHoverBg }}>
            Save Changes
          </Button>
        ) : (
          <Button
            colorScheme="gray"
            w="full"
            mt={4}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default Profile;
