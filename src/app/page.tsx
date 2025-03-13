"use client";
import HeroSection from "@/components/sections/HeroSection";
// app/page.tsx
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Link,
  Image,
} from "@chakra-ui/react";
import {
  FaGoogle,
  FaMicrosoft,
  FaSearch,
  FaChartLine,
  FaProjectDiagram,
  FaUsers,
} from "react-icons/fa";

export default function Home() {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box bg={bgColor} color={textColor}>
      {/* Navbar */}
      <Box
        w="100vw"
        bg="white"
        position="fixed"
        py={6}
        borderBottom="1px"
        borderColor="gray.200"
        zIndex={100}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading as="h1" size="xl">
              Zenflow
            </Heading>
            <Flex>
              <Link
                _hover={{
                  textDecoration: "none",
                  color: "blue.500",
                }}
                href="#"
                px={4}
                fontSize="x-large"
                fontWeight="semibold"
              >
                Features
              </Link>
              <Link
                _hover={{
                  textDecoration: "none",
                  color: "blue.500",
                }}
                fontSize="x-large"
                href="#"
                px={4}
                fontWeight="semibold"
              >
                Pricing
              </Link>
              <Link
                _hover={{
                  textDecoration: "none",
                  color: "blue.500",
                }}
                fontSize="x-large"
                fontWeight="semibold"
                href="#"
                px={4}
              >
                Contact
              </Link>
            </Flex>
            <Button colorScheme="blue" borderRadius="50px" size="lg">
              Sign In
            </Button>
          </Flex>
        </Container>
      </Box>

      <HeroSection />

      {/* Features Section */}
      <Box
        h="100vh"
        display="flex"
        alignItems="center"
        bg={useColorModeValue("gray.50", "gray.700")}
      >
        <Container maxW="container.xl">
          <Heading as="h2" size="2xl" textAlign="center" mb={10}>
            Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Icon as={FaSearch} boxSize={10} />
              <Heading as="h3" size="lg">
                Product & Issue Tracking
              </Heading>
              <Text>
                Track and manage your software development projects with ease.
              </Text>
            </VStack>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Icon as={FaChartLine} boxSize={10} />
              <Heading as="h3" size="lg">
                Plan & Launch Campaigns
              </Heading>
              <Text>Organize and execute marketing campaigns efficiently.</Text>
            </VStack>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Icon as={FaProjectDiagram} boxSize={10} />
              <Heading as="h3" size="lg">
                Plan & Track IT Projects
              </Heading>
              <Text>Keep your IT projects on track and within budget.</Text>
            </VStack>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Icon as={FaUsers} boxSize={10} />
              <Heading as="h3" size="lg">
                Build Creative Workflows
              </Heading>
              <Text>
                Design and implement creative workflows for your team.
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Goals Section */}
      <Box h="100vh" display="flex" alignItems="center">
        <Container maxW="container.xl">
          <Heading as="h2" size="2xl" textAlign="center" mb={10}>
            Align Work to Goals
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Text fontWeight="bold" fontSize="xl">
                Increase new website traffic by 5x
              </Text>
            </VStack>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Text fontWeight="bold" fontSize="xl">
                Improve customer satisfaction by 7%
              </Text>
            </VStack>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Text fontWeight="bold" fontSize="xl">
                Increase global market share 10x
              </Text>
            </VStack>
            <VStack
              spacing={4}
              textAlign="center"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <Text fontWeight="bold" fontSize="xl">
                Launch new loan product in 4 months
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        h="100vh"
        display="flex"
        alignItems="center"
        bg={useColorModeValue("gray.50", "gray.700")}
      >
        <Container maxW="container.xl">
          <Flex direction="column" align="center" textAlign="center">
            <Heading as="h2" size="2xl" mb={4}>
              Ready to streamline your workflow?
            </Heading>
            <Text fontSize="xl" mb={8}>
              Join thousands of teams who are already using Zenflow to manage
              their projects.
            </Text>
            <Button colorScheme="teal" size="lg">
              Sign Up Now
            </Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
