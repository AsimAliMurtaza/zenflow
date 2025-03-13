"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Button,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const onClickHandler = () => {
    router.push("/login");
  };

  return (
    <Box
      position="fixed"
      w="100vw"
      top={0}
      zIndex={100}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" py={4}>
          {/* Logo */}
          <Heading
            as="h1"
            size="lg"
            color={useColorModeValue("blue.600", "blue.300")}
          >
            Zenflow
          </Heading>

          {/* Desktop Navigation */}
          <Flex display={{ base: "none", md: "flex" }} align="center">
            {["Features", "Pricing", "Contact"].map((item, index) => (
              <MotionBox key={index} whileTap={{ scale: 0.95 }} mx={4}>
                <Link
                  href="#"
                  fontSize="lg"
                  fontWeight="semibold"
                  _hover={{ color: "blue.500", textDecoration: "none" }}
                >
                  {item}
                </Link>
              </MotionBox>
            ))}
          </Flex>

          {/* Buttons (Sign In & Dark Mode Toggle) */}
          <Flex align="center" gap={4}>
            {/* Dark Mode Toggle */}
            <IconButton
              aria-label="Toggle Dark Mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              size="lg"
              variant="ghost"
              borderRadius={50}
            />

            {/* Sign In Button */}
            <Button
              colorScheme="blue"
              borderRadius={50}
              size="lg"
              display={{ base: "none", md: "inline-flex" }}
                onClick={onClickHandler}
            >
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open Menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              fontSize="2xl"
              onClick={onOpen}
            />
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue("white", "gray.800")}>
          <DrawerCloseButton />

          <VStack spacing={6} mt={20} align="center">
            {["Features", "Pricing", "Contact"].map((item, index) => (
              <Link
                key={index}
                href="#"
                fontSize="xl"
                fontWeight="bold"
                onClick={onClose}
                _hover={{ color: "blue.500", textDecoration: "none" }}
              >
                {item}
              </Link>
            ))}

            {/* Dark Mode Toggle inside Mobile Menu */}
            <IconButton
              aria-label="Toggle Dark Mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              size="lg"
              variant="ghost"
            />

            {/* Sign In Button */}
            <Button
              colorScheme="blue"
              borderRadius={50}
              size="lg"
              onClick={onClickHandler}
            >
              Sign In
            </Button>
          </VStack>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
