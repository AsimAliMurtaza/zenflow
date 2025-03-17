"use client";

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Image,
  Button,
  Divider,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaStar, FaBullseye } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

const goalsData = [
  {
    icon: FaCheckCircle,
    title: "Increase Website Traffic",
    description: "Boost new website traffic by 5x.",
  },
  {
    icon: FaStar,
    title: "Enhance Customer Satisfaction",
    description: "Improve customer satisfaction by 7%.",
  },
  {
    icon: FaBullseye,
    title: "Expand Market Share",
    description: "Increase global market share 10x.",
  },
  {
    icon: FaCheckCircle,
    title: "Launch New Product",
    description: "Launch new loan product in 4 months.",
  },
  {
    icon: FaStar,
    title: "Reduce Operational Costs",
    description: "Reduce operational costs by 15%.",
  },
  {
    icon: FaBullseye,
    title: "Improve Team Efficiency",
    description: "Enhance team collaboration efficiency by 20%.",
  },
];

const GoalsSection = () => {
  const cardBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");
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
          color={headingColor}
          as={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition="duration: 0.8, ease: easeOut"
        >
          Your Goals, Our Focus
        </Heading>

        {/* Unique Grid Layout */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={10}>
          {goalsData.map((goal, index) => (
            <MotionGridItem
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <VStack
                spacing={4}
                textAlign="center"
                bg={cardBg}
                p={8}
                borderRadius="20"
                boxShadow="xl"
                backdropFilter="blur(10px)"
                borderColor={borderColor}
              >
                <Icon as={goal.icon} boxSize={8} color="blue.400" />
                <Heading size="md" color={textColor}>
                  {goal.title}
                </Heading>
                <Text color={textColor}>{goal.description}</Text>
              </VStack>
            </MotionGridItem>
          ))}
        </Grid>

        {/* Image and Text Section (Centered) */}
        <Flex
          mt={20}
          direction="column"
          align="center"
          justify="center"
          gap={8}
        >
          <Image
            src="/goals-illustration.svg"
            alt="Goals Illustration"
            borderRadius="lg"
            boxShadow="md"
            maxW="500px"
          />
          <VStack align="center" spacing={6}>
            <Heading size="xl" color={headingColor} textAlign="center">
              Transform Your Vision into Reality
            </Heading>
            <Text fontSize="lg" color={textColor} textAlign="center">
              Zenflow empowers you to turn ambitious goals into tangible
              achievements. Track progress, collaborate effectively, and
              celebrate your successes.
            </Text>
            <Button
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg }}
              size="lg"
              borderRadius="full"
            >
              Start Achieving Your Goals
            </Button>
          </VStack>
        </Flex>

        {/* Divider */}
        <Divider mt={20} mb={10} borderColor={borderColor} />

        {/* Testimonials Section (Centered) */}
        <VStack spacing={6} align="center" mt={10}>
          <Heading size="lg" color={headingColor}>
            Real Results, Real Stories
          </Heading>
          <Text fontSize="md" color={textColor} textAlign="center">
          &quot;With Zenflow, we not only met our goals but exceeded them. It&apos;s
            truly transformative.&quot;
          </Text>
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
            - Alex Rivera, Growth Strategist
          </Text>
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default GoalsSection;