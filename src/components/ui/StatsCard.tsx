import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  count: number;
  icon: IconType;
  color: string;
  iconColor?: string;
  change?: string;
}

export const StatsCard = ({
  title,
  count,
  icon,
  color,
  iconColor,
  change,
}: StatsCardProps) => (
  <Box>
    <HStack justify="space-between">
      <Box>
        <Text fontSize="sm" color={iconColor} mb={1}>
          {title}
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          {count}
        </Text>
        {change && (
          <Text fontSize="sm" color="gray.500">
            {change}
          </Text>
        )}
      </Box>
      <Icon as={icon} boxSize={8} color={color} />
    </HStack>
  </Box>
);