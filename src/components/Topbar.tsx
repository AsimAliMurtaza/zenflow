"use client";

import {
  Flex,
  Input,
  IconButton,
  Avatar,
  Spacer,
  Box,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FiSearch, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const router = useRouter();

  // Light mode colors based on the provided UI
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.500", "gray.300");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const menuBg = useColorModeValue("white", "gray.700");

  return (
    <Flex
      bg={bgColor}
      p={4}
      align="center"
      shadow="sm"
      borderBottom="1px solid"
      borderColor={borderColor}
      px={6} // Add horizontal padding for a clean look
    >
      {/* Search Input - Centered */}
      <Box flex="1" maxW="400px" mx={6} position="relative">
        <Input
          placeholder="Search..."
          borderRadius="full"
          bg={inputBg}
          border="1px solid"
          borderColor={borderColor}
          px={4}
          _focus={{ bg: "white", borderColor: "blue.400" }}
          _placeholder={{ color: iconColor }}
        />
        <IconButton
          aria-label="Search"
          icon={<FiSearch />}
          size="sm"
          position="absolute"
          right={2}
          top="50%"
          transform="translateY(-50%)"
          variant="ghost"
          color={iconColor}
          _hover={{ bg: hoverBg }}
        />
      </Box>

      <Spacer />

      {/* Notifications Icon */}
      <IconButton
        aria-label="Notifications"
        icon={<FiBell />}
        variant="ghost"
        color={iconColor}
        fontSize="xl"
        _hover={{ bg: hoverBg }}
      />

      {/* Profile Dropdown Menu */}
      <Menu>
        <MenuButton>
          <Avatar name="Asim Ali" ml={4} size="md" src="/profile.jpg" cursor="pointer" />
        </MenuButton>
        <MenuList bg={menuBg} borderColor={borderColor} shadow="lg">
          <MenuItem
            icon={<FiUser />}
            onClick={() => router.push("/dashboard/profile")}
          >
            Profile
          </MenuItem>
          <MenuItem
            icon={<FiLogOut />}
            onClick={() => {
              console.log("Logout clicked");
              // TODO: Add logout functionality
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Topbar;
