"use client";

import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  Icon,
  useColorModeValue,
  Image,
  Stack,
  Button,
  Flex,
  Divider,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaChartLine,
  FaProjectDiagram,
  FaUsers,
  FaCode,
  FaRocket,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const featureData = [
  {
    icon: FaSearch,
    title: "Product & Issue Tracking",
    description: "Track and manage your software development projects with ease.",
  },
  {
    icon: FaChartLine,
    title: "Plan & Launch Campaigns",
    description: "Organize and execute marketing campaigns efficiently.",
  },
  {
    icon: FaProjectDiagram,
    title: "Plan & Track IT Projects",
    description: "Keep your IT projects on track and within budget.",
  },
  {
    icon: FaUsers,
    title: "Build Creative Workflows",
    description: "Design and implement creative workflows for your team.",
  },
  {
    icon: FaCode,
    title: "Code Collaboration",
    description: "Collaborate on code with your team in real-time.",
  },
  {
    icon: FaRocket,
    title: "Automated Deployments",
    description: "Automate your deployment process for faster releases.",
  },
  {
    icon: FaShieldAlt,
    title: "Enhanced Security",
    description: "Ensure the security of your projects with advanced features.",
  },
  {
    icon: FaLightbulb,
    title: "Innovation Hub",
    description: "Discover new ideas and innovative solutions for your business.",
  },
];

const FeaturesSection = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const buttonBg = useColorModeValue("blue.500", "blue.400");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.500");

  return (
    <MotionBox
      as="section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      py={20}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Container maxW="container.xl">
        {/* Heading */}
        <Heading
          size="2xl"
          textAlign="center"
          mb={10}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition="duration: 0.8, ease: easeOut"
          as={motion.h2}
          color={headingColor}
        >
          Features
        </Heading>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {featureData.map((feature, index) => (
            <MotionVStack
              key={index}
              spacing={4}
              textAlign="center"
              bg={cardBg}
              p={8}
              borderRadius="30"
              boxShadow="lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon as={feature.icon} boxSize={6} color="blue.400" />
              <Text as="h3" size="sm" fontWeight="semibold" color={headingColor}>
                {feature.title}
              </Text>
              <Text color={textColor}>
                {feature.description}
              </Text>
            </MotionVStack>
          ))}
        </SimpleGrid>

        {/* Additional Section with Image and Text */}
        <Flex mt={20} direction={{ base: "column", md: "row" }} align="center" gap={8}>
          <Box flex="1">
            <Image
              src="/feature-image.svg"
              alt="Feature Illustration"
              borderRadius="lg"
              boxShadow="md"
            />
          </Box>
          <VStack flex="1" align="start" spacing={6}>
            <Heading size="xl" color={headingColor}>
              Unlock the Potential of Your Team
            </Heading>
            <Text fontSize="lg" color={textColor}>
              Experience seamless collaboration, enhanced productivity, and
              innovative solutions with Zenflow. Our platform is designed to
              empower your team and drive your projects to success.
            </Text>
            <Button
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg }}
              size="lg"
              borderRadius="full"
            >
              Get Started Today
            </Button>
          </VStack>
        </Flex>

        {/* Divider */}
        <Divider mt={20} mb={10} borderColor={useColorModeValue("gray.200", "gray.600")} />

        {/* Testimonials or Quotes Section */}
        <VStack spacing={6} align="center" mt={10}>
          <Heading size="lg" color={headingColor}>
            What Our Users Say
          </Heading>
          <Text fontSize="md" color={textColor} textAlign="center">
            "Zenflow has transformed our workflow, making project management a breeze."
          </Text>
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
            - John Doe, Project Manager
          </Text>
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default FeaturesSection;