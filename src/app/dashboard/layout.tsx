"use client";

import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Button,
  Center,
  Spinner,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
} from "@chakra-ui/react";
import { BiHome, BiUser, BiLogOut, BiSun, BiMoon } from "react-icons/bi";
import { FiUsers, FiBarChart2, FiSettings, FiSearch } from "react-icons/fi";
import { GrProjects, GrRobot } from "react-icons/gr";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AIAssistant from "@/components/AIAssistant";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { signOut, useSession } from "next-auth/react";

const navModules = [
  { name: "Your Work", icon: BiHome, path: "/dashboard" },
  { name: "Projects", icon: GrProjects, path: "/dashboard/projects" },
  { name: "Teams", icon: FiUsers, path: "/dashboard/teams" },
  { name: "AI Tasks", icon: GrRobot, path: "/dashboard/generate-task" },
  { name: "Reports", icon: FiBarChart2, path: "/dashboard/reports" },
  { name: "Settings", icon: FiSettings, path: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();

  // Jira top navbar colors
  const navbarBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const activeBg = useColorModeValue("blue.50", "blue.900");
  const activeColor = useColorModeValue("blue.600", "blue.300");
  const hoverBg = useColorModeValue("gray.100", "gray.800");
  const surfaceColor = useColorModeValue("gray.50", "gray.900");
  const searchBg = useColorModeValue("gray.100", "gray.800");
  const searchFocusBg = useColorModeValue("white", "gray.700");

  if (status === "loading") {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <Box minH="100vh" bg={surfaceColor}>
      {/* Jira-Style Top Navigation Bar */}
      <Box
        bg={navbarBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        position="sticky"
        top="0"
        zIndex="1000"
        px={{ base: 4, md: 6 }}
        py={2.5}
        shadow="xs"
      >
        <Flex justify="space-between" align="center">
          {/* Left Brand + Nav Modules */}
          <HStack spacing={6}>
            {/* Jira Brand Badge */}
            <HStack
              spacing={2}
              cursor="pointer"
              onClick={() => router.push("/dashboard")}
            >
              <Flex
                w={8}
                h={8}
                bg="blue.600"
                color="white"
                borderRadius="lg"
                align="center"
                justify="center"
                fontWeight="bold"
                fontSize="md"
                shadow="sm"
              >
                ZF
              </Flex>
              <Heading
                size="md"
                fontWeight="bold"
                letterSpacing="tight"
                color={textColor}
              >
                ZenFlow
              </Heading>
            </HStack>

            {/* Horizontal Nav Links */}
            <HStack spacing={1} display={{ base: "none", lg: "flex" }}>
              {navModules.map((module) => {
                const isActive =
                  pathname === module.path ||
                  (module.path !== "/dashboard" &&
                    pathname.startsWith(module.path));
                return (
                  <Button
                    key={module.name}
                    variant="ghost"
                    size="sm"
                    borderRadius="lg"
                    px={3}
                    py={1.5}
                    fontWeight={isActive ? "bold" : "medium"}
                    color={isActive ? activeColor : textColor}
                    bg={isActive ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg, color: activeColor }}
                    onClick={() => router.push(module.path)}
                  >
                    {module.name}
                  </Button>
                );
              })}
            </HStack>
          </HStack>

          {/* Center Search Bar */}
          <InputGroup
            size="sm"
            maxW="280px"
            display={{ base: "none", md: "flex" }}
          >
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search issues, projects..."
              borderRadius="xl"
              bg={searchBg}
              border="none"
              _focus={{
                bg: searchFocusBg,
                ring: 2,
                ringColor: "blue.500",
              }}
            />
          </InputGroup>

          {/* Right Tools & User Profile */}
          <HStack spacing={3}>
            <NotificationBell />
            <IconButton
              aria-label="Toggle theme"
              icon={
                colorMode === "light" ? (
                  <BiMoon size={18} />
                ) : (
                  <BiSun size={18} />
                )
              }
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              borderRadius="full"
            />

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                p={1}
                borderRadius="full"
                _hover={{ bg: hoverBg }}
              >
                <HStack spacing={2}>
                  <Avatar
                    size="sm"
                    name={session.user?.name || ""}
                    src={session.user?.image || ""}
                  />
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    display={{ base: "none", md: "block" }}
                  >
                    {session.user?.name}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList
                bg={navbarBg}
                borderColor={borderColor}
                shadow="xl"
                borderRadius="xl"
              >
                <Box px={4} py={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    {session.user?.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {session.user?.email}
                  </Text>
                </Box>
                <MenuItem
                  icon={<BiUser size={16} />}
                  onClick={() => router.push("/dashboard/profile")}
                >
                  Profile & Settings
                </MenuItem>
                <MenuItem
                  icon={<BiLogOut size={16} />}
                  color="red.500"
                  onClick={() => signOut()}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Mobile Horizontal Subnav */}
        <HStack
          spacing={1}
          display={{ base: "flex", lg: "none" }}
          overflowX="auto"
          pt={2}
          pb={1}
        >
          {navModules.map((module) => {
            const isActive =
              pathname === module.path ||
              (module.path !== "/dashboard" &&
                pathname.startsWith(module.path));
            return (
              <Button
                key={module.name}
                variant="ghost"
                size="xs"
                borderRadius="lg"
                px={3}
                flexShrink={0}
                fontWeight={isActive ? "bold" : "medium"}
                color={isActive ? activeColor : textColor}
                bg={isActive ? activeBg : "transparent"}
                onClick={() => router.push(module.path)}
              >
                {module.name}
              </Button>
            );
          })}
        </HStack>
      </Box>

      {/* Main Page Body */}
      <Box p={0}>
        {children}
        <AIAssistant />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
