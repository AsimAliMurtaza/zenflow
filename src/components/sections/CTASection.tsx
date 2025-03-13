"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const CTASection = () => {
  return (
    <MotionBox
      as="section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      py={24}
      textAlign="center"
      bg={useColorModeValue("white", "gray.900")}
    >
      <Container maxW="container.lg">
        <Flex direction="column" align="center" textAlign="center">
          {/* Heading */}
          <Heading
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            lineHeight="tall"
            color={useColorModeValue("gray.800", "white")}
            as={motion.h2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition="duration: 0.8, ease: easeOut"
            mb={6}
          >
            Ready to streamline your workflow?
          </Heading>

          {/* Subtitle */}
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color={useColorModeValue("gray.600", "gray.300")}
            maxW={{ base: "100%", md: "80%" }}
            mb={8}
          >
            Join teams who are already using{" "}
            <Box as="span" py="1" fontWeight="bold">
              <Typewriter
                words={["Zenflow"]}
                loop={false}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={70}
                delaySpeed={1000}
              />
            </Box>{" "}
            to manage their projects seamlessly.
          </Text>

          {/* CTA Button */}
          <MotionButton
            colorScheme="blue"
            size="lg"
            px={8}
            borderRadius={50}
            py={6}
            fontSize="xl"
            fontWeight="bold"
            boxShadow="xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up Now
          </MotionButton>
        </Flex>
      </Container>
    </MotionBox>
  );
};

export default CTASection;
