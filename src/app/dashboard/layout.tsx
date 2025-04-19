"use client";

import {
  Box,
  VStack,
  Text,
  IconButton,
  Flex,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
  Button,
  Center,
  Spinner,
  Divider,
  Heading,
  DrawerHeader,
} from "@chakra-ui/react";
import {
  BiHome,
  BiMenuAltLeft,
  BiMenu,
  BiUser,
  BiLogOut,
} from "react-icons/bi";
import { FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";
import { GrProjects, GrRobot } from "react-icons/gr";
import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AIAssistant from "@/components/AIAssistant";
import { IconType } from "react-icons/lib";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const modules = [
  { name: "Overview", icon: BiHome, path: "/dashboard" },
  { name: "Projects", icon: GrProjects, path: "/dashboard/projects" },
  { name: "Teams", icon: FiUsers, path: "/dashboard/teams" },
  { name: "AI Tasks", icon: GrRobot, path: "/dashboard/generate-task" },
  { name: "Reports", icon: FiBarChart2, path: "/dashboard/reports" },
  { name: "Settings", icon: FiSettings, path: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Material You colors
  const sidebarBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const primaryColor = useColorModeValue("blue.600", "blue.300");

  const dividerColor = useColorModeValue("gray.200", "gray.600");
  const surfaceColor = useColorModeValue("white", "gray.900");

  if (status === "loading")
    return (
      <Center h="100vh">
        <Spinner size="xl" color={primaryColor} thickness="4px" />
      </Center>
    );

  if (!session) {
    router.push("/login");
    return null;
  }

  const sidebarWidth = collapsed ? "80px" : "280px";

  const renderSidebarContent = () => (
    <VStack align="start" spacing={4} h="full">
      {/* Sidebar Header */}
      {!isMobile && (
        <Flex
          w="full"
          justifyContent={collapsed ? "center" : "space-between"}
          p={2}
          borderRadius="lg"
          align="center"
        >
          {!collapsed && (
            <Heading size="lg" fontWeight="bold" color={primaryColor}>
              ZenFlow
            </Heading>
          )}
          <IconButton
            aria-label="Toggle Sidebar"
            icon={collapsed ? <BiMenu /> : <BiMenuAltLeft />}
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="sm"
            color={textColor}
            borderRadius="full"
          />
        </Flex>
      )}

      {isMobile ? (
        <DrawerHeader>
          <Heading size="lg" fontWeight="bold" color={primaryColor}>
            ZenFlow
          </Heading>
        </DrawerHeader>
      ) : (
        <Divider borderColor={dividerColor} />
      )}

      {/* Navigation Links */}
      <VStack spacing={1} w="full" flex={1}>
        {modules.map((module) => (
          <NavItem
            key={module.name}
            icon={module.icon}
            label={module.name}
            isActive={pathname === module.path}
            onClick={() => {
              router.push(module.path);
              if (isMobile) onClose();
            }}
            collapsed={!isMobile && collapsed}
            primaryColor={primaryColor}
          />
        ))}
      </VStack>

      <Divider borderColor={dividerColor} />

      {/* Profile Section */}
      <Box w="full" pt={2}>
        <Menu>
          <Tooltip
            label={!isMobile && collapsed ? "Profile" : ""}
            placement="right"
            hasArrow
          >
            <MenuButton
              as={Button}
              variant="ghost"
              w="full"
              justifyContent={!isMobile && collapsed ? "center" : "flex-start"}
              leftIcon={
                !isMobile && collapsed ? (
                  <Avatar
                    size="sm"
                    name={session.user?.name || ""}
                    src={session.user?.image || ""}
                  />
                ) : (
                  <BiUser size={20} />
                )
              }
              rightIcon={!isMobile && !collapsed ? undefined : undefined}
              _hover={{ bg: hoverBg }}
            >
              {!isMobile && !collapsed && (
                <Flex direction="column" align="flex-start">
                  <Text fontWeight="medium">{session.user?.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {session.user?.email}
                  </Text>
                </Flex>
              )}
              {isMobile && (
                <Flex direction="column" align="flex-start">
                  <Text fontWeight="medium">{session.user?.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {session.user?.email}
                  </Text>
                </Flex>
              )}
            </MenuButton>
          </Tooltip>
          <MenuList>
            <MenuItem
              icon={<BiUser />}
              onClick={() => router.push("/dashboard/profile")}
            >
              Profile
            </MenuItem>
            <MenuItem icon={<BiLogOut />} onClick={() => signOut()}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </VStack>
  );

  return (
    <Flex minH="100vh" bg={surfaceColor}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <AnimatePresence>
          <MotionBox
            as="aside"
            w={sidebarWidth}
            initial={{ width: collapsed ? "80px" : "280px" }}
            animate={{ width: sidebarWidth }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            bg={sidebarBg}
            p={4}
            borderRadius={{ base: "none", md: "0 2xl 2xl 0" }}
            boxShadow={{ base: "none", md: "md" }}
            position="fixed"
            h="100vh"
            zIndex={20}
          >
            {renderSidebarContent()}
          </MotionBox>
        </AnimatePresence>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <IconButton
            aria-label="Open menu"
            icon={<BiMenu />}
            onClick={onOpen}
            position="fixed"
            top={4}
            left={4}
            zIndex={10}
            borderRadius={"full"}
            colorScheme="gray"
            variant={"ghost"}
          />
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg={sidebarBg}>
              <DrawerCloseButton />
              <DrawerBody>{renderSidebarContent()}</DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {/* Main Content */}
      <Box
        flex="1"
        ml={!isMobile ? sidebarWidth : 0}
        transition="margin-left 0.3s ease"
      >
        {children}
        <AIAssistant/>
      </Box>
    </Flex>
  );
};

const NavItem = ({
  icon,
  label,
  isActive,
  onClick,
  collapsed,
  primaryColor,
}: {
  icon: IconType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  collapsed: boolean;
  primaryColor: string;
}) => {
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("blue.50", "blue.900");

  return (
    <Tooltip label={collapsed ? label : ""} placement="right" hasArrow>
      <Button
        justifyContent={collapsed ? "center" : "flex-start"}
        variant="ghost"
        w="full"
        px={4}
        py={6}
        borderRadius="full"
        fontWeight="medium"
        fontSize="md"
        leftIcon={<Box as={icon} />}
        iconSpacing={collapsed ? 0 : 3}
        _hover={{ bg: hoverBg }}
        _active={{ bg: activeBg }}
        onClick={onClick}
        isActive={isActive}
        color={isActive ? primaryColor : "inherit"}
      >
        {!collapsed && label}
      </Button>
    </Tooltip>
  );
};

export default DashboardLayout;
