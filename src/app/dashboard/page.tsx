"use client";

import {
  Box,
  Flex,
  Text,
  Grid,
  Button,
  Input,
  VStack,
  Icon,
  Avatar,
  useColorModeValue,
  Card,
  CardBody,
  HStack,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { FiHome, FiCheckCircle, FiClock, FiPlus } from "react-icons/fi";

const DashboardContent = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex flex="1" flexDir="column" p={8} bg={bgColor} minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Dashboard
      </Text>

      {/* Stats Grid */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={6}>
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
            transition="all 0.2s"
            _hover={{ transform: "scale(1.02)" }}
          >
            <CardBody>
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color={iconColor}>
                    {title}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {count}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {change}
                  </Text>
                </Box>
                <Icon as={icon} boxSize={6} color={color} />
              </HStack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Task Creation */}
      <Card
        bg={cardBg}
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        mb={6}
        p={4}
        transition="all 0.2s"
        _hover={{ shadow: "lg" }}
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            AI Task Creation
          </Text>
          <HStack>
            <Input
              placeholder="Describe your task..."
              borderColor={borderColor}
              _focus={{ borderColor: "blue.400", shadow: "sm" }}
            />
            <Button leftIcon={<FiPlus />} colorScheme="blue">
              Create Task
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card
        bg={cardBg}
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        p={4}
        transition="all 0.2s"
        _hover={{ shadow: "lg" }}
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Recent Activity
          </Text>
          <Divider mb={3} />
          <VStack align="start" spacing={3}>
            {[
              { text: "John completed the homepage design", color: "green.500" },
              { text: "Sarah added comments to the marketing plan", color: "blue.500" },
              { text: "Team meeting scheduled for tomorrow at 10 AM", color: "purple.500" },
            ].map(({ text, color }, index) => (
              <HStack key={index} spacing={2}>
                <Box w={2} h={2} bg={color} borderRadius="full" />
                <Text fontSize="sm" color={textColor}>
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default DashboardContent;
