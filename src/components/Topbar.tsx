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

  const bgColor = useColorModeValue("whiteAlpha.900", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const menuBg = useColorModeValue("white", "gray.800");

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
      zIndex="1100"
      boxShadow="md"
    >
      <Box flex="1" maxW="280px" mx={2} position="relative">
        <Input
          placeholder="Search..."
          borderRadius="full"
          bg={inputBg}
          border="none"
          px={4}
          py={2}
          maxH="34px"
          _focus={{ bg: useColorModeValue("gray.200", "gray.600"), boxShadow: "md" }}
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

      <IconButton
        aria-label="Notifications"
        icon={<FiBell />}
        variant="ghost"
        color={iconColor}
        fontSize="xl"
        borderRadius="full"
        _hover={{ bg: hoverBg, transform: "scale(1.1)", transition: "0.2s" }}
      />

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
          zIndex="1200"
          borderColor={borderColor}
          shadow="xl"
          borderRadius="xl"
        >
          <MenuItem
            icon={<FiUser />}
            onClick={() => router.push("/dashboard/profile")}
            borderRadius="lg"
            _hover={{ bg: hoverBg }}
          >
            Profile
          </MenuItem>
          <MenuItem
            icon={<FiLogOut />}
            onClick={() => signOut({ callbackUrl: "/" })}
            borderRadius="lg"
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