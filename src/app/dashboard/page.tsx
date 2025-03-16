"use client";

import {
  Box,
  Flex,
  Text,
  Grid,
  VStack,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  HStack,
  Divider,
  Badge,
  Progress,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { FiHome, FiCheckCircle, FiClock, FiUser, FiAlertCircle } from "react-icons/fi";

const DashboardContent = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const statCardHover = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex flex="1" flexDir="column" p={8} bg={bgColor} minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
        Dashboard
      </Text>

      {/* Stats Grid */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
        {[
          { title: "Total Tasks", count: 24, change: "+2 from yesterday", icon: FiHome, color: "blue.500" },
          { title: "Completed Tasks", count: 16, change: "+5 from yesterday", icon: FiCheckCircle, color: "green.500" },
          { title: "Upcoming Deadlines", count: 3, change: "Within 48 hours", icon: FiClock, color: "purple.500" },
        ].map(({ title, count, change, icon, color }, index) => (
          <Card
            key={index}
            bg={cardBg}
            shadow="md"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="2xl"
            transition="background-color 0.3s ease"
            _hover={{ bg: statCardHover }}
          >
            <CardBody>
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color={iconColor} mb={1}>
                    {title}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {count}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {change}
                  </Text>
                </Box>
                <Icon as={icon} boxSize={8} color={color} />
              </HStack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Card
        bg={cardBg}
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        p={6}
        mb={8}
        transition="background-color 0.3s ease"
        _hover={{ bg: statCardHover }}
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
            Recent Activity
          </Text>
          <Divider mb={4} />
          <VStack align="start" spacing={4}>
            {[
              { text: "John completed the homepage design", color: "green.500", icon: FiCheckCircle },
              { text: "Sarah added comments to the marketing plan", color: "blue.500", icon: FiUser },
              { text: "Team meeting scheduled for tomorrow at 10 AM", color: "purple.500", icon: FiAlertCircle },
            ].map(({ text, color, icon }, index) => (
              <HStack key={index} spacing={3}>
                <Icon as={icon} boxSize={5} color={color} />
                <Text fontSize="sm" color={textColor}>
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Team Progress */}
      <Card
        bg={cardBg}
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        p={6}
        transition="background-color 0.3s ease"
        _hover={{ bg: statCardHover }}
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
            Team Progress
          </Text>
          <Divider mb={4} />
          <VStack align="start" spacing={4}>
            {[
              { name: "AI Research Team", progress: 80, members: ["Alice", "Bob", "Charlie"] },
              { name: "Web Dev Team", progress: 60, members: ["David", "Eve"] },
              { name: "Marketing Team", progress: 45, members: ["Frank", "Grace"] },
            ].map(({ name, progress, members }, index) => (
              <Box key={index} w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="md" fontWeight="medium" color={textColor}>
                    {name}
                  </Text>
                  <Badge colorScheme={progress > 70 ? "green" : progress > 40 ? "yellow" : "red"} borderRadius="full">
                    {progress}%
                  </Badge>
                </HStack>
                <Progress value={progress} colorScheme="blue" size="sm" borderRadius="full" mb={2} />
                <AvatarGroup size="sm" max={3}>
                  {members.map((member, idx) => (
                    <Avatar key={idx} name={member} />
                  ))}
                </AvatarGroup>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default DashboardContent;