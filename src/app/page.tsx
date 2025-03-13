"use client";
import CTASection from "@/components/sections/CTASection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import Footer from "@/components/sections/Footer";
import GoalsSection from "@/components/sections/GoalsSection";
import HeroSection from "@/components/sections/HeroSection";
import Navbar from "@/components/sections/Navbar";
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
    <Box>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <GoalsSection />
      <CTASection />
      <Footer />
    </Box>
  );
}
