"use client";

import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Button,
  Input,
  VStack,
  Icon,
  Avatar,
  useColorModeValue,
  Card,
  CardBody,
  HStack,
} from "@chakra-ui/react";
import { FiHome, FiCheckCircle, FiClock, FiPlus } from "react-icons/fi";

const DashboardContent = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Flex flex="1" flexDir="column" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Dashboard
      </Text>

      {/* Stats Grid */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
        <Card
          bg={cardBg}
          shadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Total Tasks
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  24
                </Text>
                <Text fontSize="sm" color="gray.500">
                  +2 from yesterday
                </Text>
              </Box>
              <Icon as={FiHome} boxSize={6} color="blue.500" />
            </HStack>
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          shadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Completed Tasks
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  16
                </Text>
                <Text fontSize="sm" color="gray.500">
                  +5 from yesterday
                </Text>
              </Box>
              <Icon as={FiCheckCircle} boxSize={6} color="green.500" />
            </HStack>
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          shadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Upcoming Deadlines
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  3
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Within next 48 hours
                </Text>
              </Box>
              <Icon as={FiClock} boxSize={6} color="purple.500" />
            </HStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Task Creation */}
      <Card
        bg={cardBg}
        shadow="sm"
        border="1px solid"
        borderColor={borderColor}
        mb={6}
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            AI Task Creation
          </Text>
          <HStack>
            <Input placeholder="Describe your task..." />
            <Button leftIcon={<FiPlus />} colorScheme="blue">
              Create Task
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card
        bg={cardBg}
        shadow="sm"
        border="1px solid"
        borderColor={borderColor}
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Recent Activity
          </Text>
          <VStack align="start" spacing={3}>
            <HStack>
              <Box w={2} h={2} bg="green.500" borderRadius="full" />
              <Text fontSize="sm">John completed the homepage design</Text>
            </HStack>
            <HStack>
              <Box w={2} h={2} bg="blue.500" borderRadius="full" />
              <Text fontSize="sm">
                Sarah added comments to the marketing plan
              </Text>
            </HStack>
            <HStack>
              <Box w={2} h={2} bg="purple.500" borderRadius="full" />
              <Text fontSize="sm">
                Team meeting scheduled for tomorrow at 10 AM
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default DashboardContent;
