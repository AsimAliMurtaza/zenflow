"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

const HeroSection = () => {
  return (
    <Box
      h="50vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("white", "gray.800")}
      px={4}
      mt={{ base: 28, lg: 24, md: 24 }}
    >
      <Container maxW="container.xl" maxH="50vh">
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr auto 1fr" }} // Three columns for the divider
          gap={{ base: 6, lg: 10 }}
          alignItems="center"
        >
          {/* Left Column: Text */}
          <GridItem textAlign={{ base: "center", lg: "left" }}>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              mb={4}
              lineHeight="tall"
            >
              Begin your journey with{" "}
              <Box
                as="span"
                px="4"
                py="1"
                bg="blue.400"
                color="white"
                fontWeight="bold"
              >
                <Typewriter
                  words={[
                    "Productivity.",
                    "Creativity.",
                    "Collaboration.",
                    "Us.",
                    "Zenflow.",
                  ]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={70}
                  delaySpeed={1000}
                />
              </Box>
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight={1.6}
              color={useColorModeValue("gray.600", "gray.300")}
              maxW={{ base: "100%", lg: "80%" }}
              mx={{ base: "auto", lg: "0" }}
            >
              The only project management tool you need to plan and track work
              across every team.
            </Text>
          </GridItem>

          {/* Middle Column: Divider (Only on Large Screens) */}
          <Divider orientation="vertical" h="100%" borderColor="gray.300" />

          {/* Right Column: Buttons */}
          <GridItem>
            <Flex direction="column" align="center" gap={4}>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={useColorModeValue("gray.600", "gray.300")}
                maxW={{ base: "100%", lg: "80%" }}
                mx={{ base: "auto", lg: "0" }}
              >
                Continue with
              </Text>
              <Button
                leftIcon={<Icon as={FaGoogle} />}
                colorScheme="blue"
                variant="solid"
                size="lg"
                borderRadius={50}
                w={{ base: "full", md: "60%" }}
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Continue with Google
              </Button>
              <Button
                leftIcon={<Icon as={FaGithub} />}
                colorScheme="gray"
                variant="outline"
                size="lg"
                borderRadius={50}
                w={{ base: "full", md: "60%" }}
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              >
                Continue with Github
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
