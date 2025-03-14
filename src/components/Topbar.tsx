"use client";

import {
  Flex,
  Input,
  IconButton,
  Avatar,
  Spacer,
  Box,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FiSearch, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Topbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const bgColor = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const inputBg = useColorModeValue("whiteAlpha.800", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("blue.100", "blue.700");
  const menuBg = useColorModeValue("white", "gray.700");

  return (
    <Flex
      bg={bgColor}
      p={3}
      align="center"
      borderBottom="1px solid"
      borderColor={borderColor}
      backdropFilter="blur(10px)"
      position="sticky"
      top={0}
      zIndex="1100" // Ensures Topbar is always on top
    >
      {/* Search Input */}
      <Box flex="1" maxW="280px" mx={2} position="relative">
        <Input
          placeholder="Search..."
          borderRadius="full"
          bg={inputBg}
          border="1px solid"
          borderColor={borderColor}
          px={4}
          py={2}
          maxH="34px"
          _focus={{ bg: "white", borderColor: "blue.400", shadow: "md" }}
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
          borderRadius="full"
          color={iconColor}
          _hover={{ bg: hoverBg, transition: "0.2s" }}
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
        borderRadius="full"
        _hover={{ bg: hoverBg, transform: "scale(1.1)", transition: "0.2s" }}
      />

      {/* Profile Dropdown Menu */}
      <Menu>
        <MenuButton>
          <Avatar
            name={session?.user?.name || "User"}
            ml={4}
            size="sm"
            src={session?.user?.image || ""}
            cursor="pointer"
            _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
          />
        </MenuButton>
        <MenuList
          bg={menuBg}
          zIndex="1200" // Ensures MenuList is above everything
          borderColor={borderColor}
          shadow="xl"
          borderRadius="12px"
        >
          <MenuItem
            icon={<FiUser />}
            onClick={() => router.push("/dashboard/profile")}
            borderRadius="8px"
            _hover={{ bg: hoverBg }}
          >
            Profile
          </MenuItem>
          <MenuItem
            icon={<FiLogOut />}
            onClick={() => signOut({ callbackUrl: "/" })}
            borderRadius="8px"
            _hover={{ bg: hoverBg }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Topbar;
