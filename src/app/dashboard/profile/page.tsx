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
  Progress,
  HStack,
  Icon,
  Divider,
  Badge,
  Card,
  CardBody,
  Grid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiEdit,
  FiCheckCircle,
  FiActivity,
  FiSettings,
  FiUser,
  FiMail,
  FiBriefcase,
} from "react-icons/fi";

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
  const cardBg = useColorModeValue("gray.50", "gray.800");

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
    <Box bg={bgColor} p={8} minH="100vh">
      <Flex
        direction={{ base: "column", md: "row" }}
        maxW="1200px"
        mx="auto"
        gap={8}
      >
        {/* Left Side: Profile Details */}
        <Box flex="1" bg={cardBg} p={6} borderRadius="2xl" shadow="lg">
          <Flex direction="column" align="center">
            <Avatar
              size="xl"
              name={name}
              src={session?.user?.image || "/profile.jpg"}
              mb={4}
            />
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {name}
            </Text>
            <Text fontSize="md" color="gray.500">
              {email}
            </Text>
            <Badge colorScheme="teal" mt={2} borderRadius="full">
              {role}
            </Badge>
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
                borderRadius="lg"
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
                borderRadius="lg"
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
                borderRadius="lg"
              />
            </Box>

            {isEditing ? (
              <Button
                bg={buttonBg}
                color="white"
                w="full"
                mt={4}
                onClick={handleSave}
                _hover={{ bg: buttonHoverBg }}
                borderRadius="full"
              >
                Save Changes
              </Button>
            ) : (
              <Button
                colorScheme="gray"
                w="full"
                mt={4}
                onClick={() => setIsEditing(true)}
                borderRadius="full"
              >
                Edit Profile
              </Button>
            )}
          </VStack>

          {/* Profile Completion Progress */}
          <Box mt={8}>
            <Text fontSize="sm" fontWeight="bold" color={textColor} mb={2}>
              Profile Completion
            </Text>
            <Progress
              value={80}
              colorScheme="teal"
              size="sm"
              borderRadius="full"
            />
            <Text fontSize="sm" color="gray.500" mt={2}>
              80% Complete
            </Text>
          </Box>
        </Box>

        {/* Right Side: User Activity and Stats */}
        <Box flex="2" bg={cardBg} p={6} borderRadius="2xl" shadow="lg">
          <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
            User Activity
          </Text>

          {/* Recent Activity */}
          <VStack align="start" spacing={4}>
            {[
              {
                text: "Updated profile information",
                icon: FiEdit,
                color: "blue.500",
              },
              {
                text: "Completed task 'Design Homepage'",
                icon: FiCheckCircle,
                color: "green.500",
              },
              {
                text: "Joined new project 'AI Research'",
                icon: FiActivity,
                color: "purple.500",
              },
              {
                text: "Changed account settings",
                icon: FiSettings,
                color: "orange.500",
              },
            ].map(({ text, icon, color }, index) => (
              <HStack key={index} spacing={3}>
                <Icon as={icon} boxSize={5} color={color} />
                <Text fontSize="sm" color={textColor}>
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Divider my={6} />

          {/* User Stats */}
          <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
            User Stats
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {[
              {
                title: "Tasks Completed",
                value: 24,
                icon: FiCheckCircle,
                color: "green.500",
              },
              {
                title: "Projects Joined",
                value: 3,
                icon: FiBriefcase,
                color: "blue.500",
              },
              {
                title: "Team Members",
                value: 8,
                icon: FiUser,
                color: "purple.500",
              },
              {
                title: "Emails Sent",
                value: 12,
                icon: FiMail,
                color: "orange.500",
              },
            ].map(({ title, value, icon, color }, index) => (
              <Card key={index} bg={bgColor} borderRadius="lg" shadow="sm">
                <CardBody>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        {title}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        {value}
                      </Text>
                    </Box>
                    <Icon as={icon} boxSize={6} color={color} />
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
};

export default Profile;
