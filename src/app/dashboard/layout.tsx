"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  Box,
  VStack,
  Text,
  IconButton,
  Flex,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { BiHome, BiMenuAltLeft, BiMenu } from "react-icons/bi";
import { FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";
import { GrProjects } from "react-icons/gr";
import Topbar from "@/components/Topbar";

// Sidebar navigation modules
const modules = [
  { name: "Overview", icon: BiHome, path: "/dashboard" },
  { name: "Projects", icon: GrProjects, path: "/dashboard/projects" },
  { name: "Teams", icon: FiUsers, path: "/dashboard/teams" },
  { name: "Reports", icon: FiBarChart2, path: "/dashboard/reports" },
  { name: "Settings", icon: FiSettings, path: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const hoverColor = useColorModeValue("blue.400", "blue.600");
  const textColor = useColorModeValue("gray.800", "white");
  const sidebarBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        color={textColor}
        bg={sidebarBg}
        p={5}
        borderRightWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        w={collapsed ? "80px" : "250px"}
        transition="width 0.3s ease-in-out"
        overflow="hidden"
      >
        {/* Toggle Button */}
        <Flex justify="space-between" align="center" mb={6}>
          {!collapsed && (
            <Text fontSize="2xl" fontWeight="bold">
              ZenFlow
            </Text>
          )}
          <IconButton
            aria-label="Toggle Sidebar"
            icon={collapsed ? <BiMenu size={24} /> : <BiMenuAltLeft size={24} />}
            variant="ghost"
            borderRadius="50"
            onClick={() => setCollapsed(!collapsed)}
          />
        </Flex>

        <VStack align="start" spacing={2}>
          {modules.map((module) => (
            <NavItem
              key={module.name}
              icon={module.icon}
              label={module.name}
              isActive={pathname === module.path}
              hoverColor={hoverColor}
              onClick={() => router.push(module.path)}
              collapsed={collapsed}
            />
          ))}
        </VStack>
      </Box>

      {/* Main Content */}
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
  collapsed,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  hoverColor: string;
  onClick: () => void;
  collapsed: boolean;
}) => {
  return (
    <Tooltip label={collapsed ? label : ""} placement="right">
      <Flex
        align="center"
        w="full"
        borderRadius="50"
        cursor="pointer"
        bg={isActive ? "blue.500" : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={{ bg: hoverColor, color: "white" , transform: "scale(1.05)", transition: "0.2s" }}
        onClick={onClick}
      >
        <IconButton
          aria-label={label}
          icon={icon({ size: 20 })}
          variant="ghost"
          color="inherit"
          _hover={{ bg: "transparent" }}
        />
        {!collapsed && (
          <Text ml={2} fontWeight="medium">
            {label}
          </Text>
        )}
      </Flex>
    </Tooltip>
  );
};

export default DashboardLayout;
