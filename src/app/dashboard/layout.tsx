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
import { IconType } from "react-icons/lib";

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

  const hoverColor = useColorModeValue("blue.500", "blue.600");
  const textColor = useColorModeValue("gray.800", "white");
  const sidebarBg = useColorModeValue("gray.50", "gray.900");
  const sidebarBorderColor = useColorModeValue("gray.200", "gray.700");
  const toggleButtonBg = useColorModeValue("gray.100", "gray.800");

  const sidebarWidth = collapsed ? "80px" : "250px";

  return (
    <Flex h="100vh" overflow="hidden">
      <Box
        position="fixed"
        left="0"
        top="0"
        h="100vh"
        w={sidebarWidth}
        bg={sidebarBg}
        color={textColor}
        p={5}
        borderRightRadius="xl"
        borderRightWidth="1px"
        borderColor={sidebarBorderColor}
        transition="width 0.3s ease-in-out"
        overflow="hidden"
        zIndex="1100"
      >
        <Flex justify="space-between" align="center" mb={6}>
          {!collapsed && (
            <Text fontSize="2xl" fontWeight="semibold">
              ZenFlow
            </Text>
          )}
          <IconButton
            aria-label="Toggle Sidebar"
            icon={
              collapsed ? <BiMenu size={24} /> : <BiMenuAltLeft size={24} />
            }
            variant="ghost"
            borderRadius="full"
            onClick={() => setCollapsed(!collapsed)}
            bg={toggleButtonBg}
            _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
          />
        </Flex>

        <VStack align="start" spacing={2} w="full">
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

      <Box
        flex="1"
        maxW="100vw"
        ml={sidebarWidth}
        transition="margin-left 0.3s ease-in-out"
        overflowY="auto"
      >
        <Topbar />
        {children}
      </Box>
    </Flex>
  );
};

const NavItem = ({
  icon,
  label,
  isActive,
  hoverColor,
  onClick,
  collapsed,
}: {
  icon: IconType;
  label: string;
  isActive: boolean;
  hoverColor: string;
  onClick: () => void;
  collapsed: boolean;
}) => {
  const navItemBg = useColorModeValue("gray.100", "gray.800");
  const activeNavItemBg = "blue.500";

  return (
    <Tooltip label={collapsed ? label : ""} placement="right">
      <Flex
        align="center"
        w="full"
        borderRadius="xl"
        cursor="pointer"
        bg={isActive ? activeNavItemBg : navItemBg}
        color={isActive ? "white" : "inherit"}
        _hover={{
          bg: hoverColor,
          color: "white",
          transform: "scale(1.05)",
          transition: "0.2s",
        }}
        onClick={onClick}
      >
       <IconButton
          aria-label={label}
          icon={<Box as={icon} size={20} />} // Correct usage here
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
