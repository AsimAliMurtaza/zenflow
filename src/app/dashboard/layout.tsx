"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  Box,
  VStack,
  Text,
  IconButton,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { BiHome, BiSolidDashboard } from "react-icons/bi";
import { FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";
import Topbar from "@/components/Topbar";
import { GrProjects } from "react-icons/gr";

// Sidebar navigation modules
const modules = [
  { name: "Overview", icon: BiHome, path: "/dashboard" },
  { name: "Board", icon: BiSolidDashboard, path: "/dashboard/board" },
  { name: "Projects", icon: GrProjects, path: "/dashboard/projects" },
  { name: "Teams", icon: FiUsers, path: "/dashboard/teams" },
  { name: "Reports", icon: FiBarChart2, path: "/dashboard/reports" },
  { name: "Settings", icon: FiSettings, path: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const hoverColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        color={textColor}
        p={4}
        borderRightWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        minW="250px"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="left">
          zenflow
        </Text>
        <VStack align="start" spacing={2}>
          {modules.map((module) => (
            <NavItem
              key={module.name}
              icon={module.icon}
              label={module.name}
              isActive={pathname === module.path}
              hoverColor={hoverColor}
              onClick={() => router.push(module.path)}
            />
          ))}
        </VStack>
      </Box>

      {/* Main Content Window */}
      <Box flex="1" maxW="100vw">
        <Topbar />
        {children}
      </Box>
    </Flex>
  );
};

// Navigation Item Component
const NavItem = ({
  icon,
  label,
  isActive,
  hoverColor,
  onClick,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  hoverColor: string;
  onClick: () => void;
}) => {
  return (
    <Flex
      align="center"
      w="full"
      borderRadius="10"
      cursor="pointer"
      bg={isActive ? "gray.700" : "transparent"}
      color={isActive ? "white" : "inherit"}
      _hover={{ bg: hoverColor, transform: "scale(1.05)", transition: "0.2s" }}
      onClick={onClick}
    >
      <IconButton
        aria-label={label}
        icon={icon({ size: 20 })}
        variant="ghost"
        color="inherit"
        _hover={{ bg: "transparent" }}
      />
      <Text ml={3} fontWeight="medium">
        {label}
      </Text>
    </Flex>
  );
};

export default DashboardLayout;
