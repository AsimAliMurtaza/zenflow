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
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

const HeroSection = () => {
  return (
    <Box
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.50", "gray.800")}
      px={4}
    >
      <Container maxW="container.xl">
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
                  words={["Zenflow"]}
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
          <GridItem display={{ base: "none", lg: "block" }}>
            <Divider orientation="vertical" h="80%" borderColor="gray.500" />
          </GridItem>

          {/* Right Column: Buttons */}
          <GridItem>
            <Flex direction="column" align="center" gap={4}>
              <Button
                leftIcon={<Icon as={FaGoogle} />}
                colorScheme="blue"
                variant="solid"
                size="lg"
                w={{ base: "full", md: "80%" }}
              >
                Continue with Google
              </Button>
              <Button
                leftIcon={<Icon as={FaMicrosoft} />}
                colorScheme="gray"
                variant="outline"
                size="lg"
                w={{ base: "full", md: "80%" }}
              >
                Continue with Microsoft
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
