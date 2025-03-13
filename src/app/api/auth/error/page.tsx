"use client";

import {
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignInErrorPage() {
  const router = useRouter();

  // ZenFlow's color scheme
  const cardBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const buttonBg = useColorModeValue("teal.500", "teal.400");
  const buttonHoverBg = useColorModeValue("teal.600", "teal.500");
  const borderColor = useColorModeValue("teal.400", "teal.300");
  const errorColor = useColorModeValue("red.500", "red.400");

  return (
    <Flex
      minH="100vh"
      bgGradient="linear(to-br, #121826, #1D2B36)" // ZenFlow's dark futuristic gradient
      justify="center"
      align="center"
      p={4}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack
          spacing={6}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          bg={cardBg}
          textAlign="center"
          maxW="400px"
          w="full"
          border="1px solid"
          borderColor={borderColor}
        >
          {/* Error Heading */}
          <Heading size="xl" color={errorColor} fontWeight="bold">
            Sign-In Error
          </Heading>
          <Text fontSize="md" color={textColor}>
            Something went wrong while signing in. Please try again or reset your credentials.
          </Text>

          <Box w="full">
            {/* Back to Login Button */}
            <Button
              onClick={() => router.push("/login")}
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg, transform: "scale(1.05)" }}
              _active={{ bg: buttonHoverBg }}
              w="full"
              size="lg"
              transition="all 0.2s"
            >
              Back to Login
            </Button>

            {/* Home Button */}
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              color={buttonBg}
              borderColor={buttonBg}
              _hover={{ bg: "teal.50", transform: "scale(1.05)" }}
              _active={{ bg: "teal.100" }}
              w="full"
              size="lg"
              mt={3}
              transition="all 0.2s"
            >
              Go to Home
            </Button>
          </Box>
        </VStack>
      </motion.div>
    </Flex>
  );
}
