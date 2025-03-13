"use client";

import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const goalsData = [
  "Increase new website traffic by 5x",
  "Improve customer satisfaction by 7%",
  "Increase global market share 10x",
  "Launch new loan product in 4 months",
];

const GoalsSection = () => {
  return (
    <MotionBox
      as="section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      py={20}
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <Container maxW="container.xl">
        {/* Section Heading */}
        <Heading
          size="2xl"
          textAlign="center"
          mb={12}
          fontWeight="extrabold"
          letterSpacing="wide"
          color={useColorModeValue("gray.800", "white")}
          as={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition="duration: 0.8, ease: easeOut"
        >
          Align Work to Goals
        </Heading>

        {/* Goals Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {goalsData.map((goal, index) => (
            <MotionVStack
              key={index}
              spacing={4}
              textAlign="center"
              bg={useColorModeValue("whiteAlpha.800", "whiteAlpha.200")}
              p={10}
              borderRadius="20"
              boxShadow="xl"
              backdropFilter="blur(10px)"
              borderColor={useColorModeValue("gray.300", "gray.600")}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Text
                fontSize="xl"
                color={useColorModeValue("gray.800", "white")}
              >
                {goal}
              </Text>
            </MotionVStack>
          ))}
        </SimpleGrid>
      </Container>
    </MotionBox>
  );
};

export default GoalsSection;
