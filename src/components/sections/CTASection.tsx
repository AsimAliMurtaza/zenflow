"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Stack,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const CTASection = () => {
  const router = useRouter();

  const onClickHandler = async () => {
    router.push("/signup");
  };

  const bgColor = useColorModeValue("white", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const buttonBg = useColorModeValue("blue.500", "blue.400");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.500");

  return (
    <MotionBox
      as="section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      py={24}
      bg={bgColor}
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 8, md: 16 }}
        >
          {/* Text Content */}
          <Stack
            direction="column"
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            flex="1"
            spacing={6}
          >
            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              lineHeight="tall"
              color={headingColor}
              as={motion.h2}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition="duration: 0.8, ease: easeOut"
            >
              Unlock Your Teams Potential
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              maxW="80%"
            >
              Experience seamless collaboration and boost productivity with{" "}
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
              </Box>
              . Join the teams who are transforming their workflows.
            </Text>
            <MotionButton
              bg={buttonBg}
              color="white"
              size="lg"
              px={8}
              borderRadius={50}
              py={6}
              fontSize="xl"
              fontWeight="bold"
              boxShadow="xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClickHandler}
              _hover={{ bg: buttonHoverBg }}
            >
              Get Started Now
            </MotionButton>
          </Stack>

          {/* Image Content */}
          <Box flex="1" display={{ base: "none", md: "block" }}>
            <Image
              src="/cta-illustration.svg"
              alt="CTA Illustration"
              borderRadius="lg"
              boxShadow="lg"
            />
          </Box>
        </Flex>
      </Container>
    </MotionBox>
  );
};

export default CTASection;
