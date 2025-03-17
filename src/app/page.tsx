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

} from "@chakra-ui/react";

export default function Home() {

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
