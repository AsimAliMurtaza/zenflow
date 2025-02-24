"use client";
import {
  Box,
  VStack,
  Text,
  IconButton,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiGrid, FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  // Use Chakra UI color mode values
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const hoverColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box
      w="250px"
      bg={bgColor}
      color={textColor}
      p={4}
      maxH={"100vh"}
      borderRightWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderRadius="xl"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Zenflow
      </Text>
      <VStack align="start" spacing={2}>
        <NavItem icon={FiGrid} label="Projects" hoverColor={hoverColor} />
        <NavItem icon={FiUsers} label="Teams" hoverColor={hoverColor} />
        <NavItem icon={FiBarChart2} label="Reports" hoverColor={hoverColor} />
        <NavItem icon={FiSettings} label="Settings" hoverColor={hoverColor} />
      </VStack>
    </Box>
  );
};

const NavItem = ({
  icon,
  label,
  hoverColor,
}: {
  icon: any;
  label: string;
  hoverColor: string;
}) => (
  <Flex
    align="center"
    w="full"
    borderRadius="full"
    _hover={{ bg: hoverColor, transform: "scale(1.05)", transition: "0.2s" }}
    cursor="pointer"
  >
    <IconButton
      aria-label={label}
      icon={icon({ size: 20 })}
      variant="ghost"
      color="inherit"
      _hover={{ bg: "transparent" }}
    />
    <Text ml={3} mr={6} fontWeight="medium">
      {label}
    </Text>
  </Flex>
);

export default Sidebar;
