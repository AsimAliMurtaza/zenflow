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
} from "@chakra-ui/react";
import {
  FaSearch,
  FaChartLine,
  FaProjectDiagram,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const featureData = [
  {
    icon: FaSearch,
    title: "Product & Issue Tracking",
    description:
      "Track and manage your software development projects with ease.",
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
];

const FeaturesSection = () => {
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
              bg={useColorModeValue("white", "gray.700")}
              p={8}
              borderRadius="30"
              boxShadow="lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
              <Icon as={feature.icon} boxSize={6} color="blue.400" />
              <Text as="h3" size="sm">
                {feature.title}
              </Text>
              <Text color={useColorModeValue("gray.600", "gray.300")}>
                {feature.description}
              </Text>
       
            </MotionVStack>
          ))}
        </SimpleGrid>
      </Container>
    </MotionBox>
  );
};

export default FeaturesSection;
