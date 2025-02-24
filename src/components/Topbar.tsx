'use client';
import {
  Flex,
  Input,
  IconButton,
  Avatar,
  Spacer,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { FiSearch, FiBell } from "react-icons/fi";

const Topbar = () => {
  // Dynamic color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  return (
    <Flex
      bg={bgColor}
      p={4}
      align="center"
      shadow="sm"
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      {/* Search Input with subtle styling */}
      <Box position="relative" w="300px">
        <Input
          placeholder="Search..."
          borderRadius="full"
          bg={inputBg}
          border="none"
          px={4}
          _focus={{ bg: "white", border: "1px solid", borderColor }}
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

      {/* User Avatar */}
      <Avatar name="Asim Ali" ml={4} size="md" />
    </Flex>
  );
};

export default Topbar;
