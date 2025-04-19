// components/TeamCard.tsx
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  IconButton,
  VStack,
  Avatar,
  Text,
  useColorModeValue,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Team } from "@/types/types";

type TeamCardProps = {
  team: Team;
  onDeleteTeam: (teamId: string) => void;
  onAddMember: (teamId: string) => void;
  onDeleteMember: (teamId: string, memberEmail: string) => void;
};

const TeamCard = ({
  team,
  onDeleteTeam,
  onAddMember,
  onDeleteMember,
}: TeamCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const memberBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.900", "gray.100");

  return (
    <Card shadow="lg" borderRadius="2xl" bg={cardBg} boxShadow="lg" overflow="hidden">
      <CardHeader p={4}>
        <Flex align="center" justify="space-between">
          <Heading size="md" fontWeight="semibold" color={headingColor}>
            {team.name}
          </Heading>
          <Tooltip label="Delete Team">
            <IconButton
              aria-label="Delete team"
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTeam(team._id)}
            />
          </Tooltip>
        </Flex>
      </CardHeader>
      <CardBody p={4}>
        {team.members && team.members.length > 0 ? (
          <VStack align="start" spacing={3}>
            {team.members.map((memberEmail: string, index: number) => (
              <Flex
                key={index}
                align="center"
                justify="space-between"
                w="full"
                p={2}
                borderRadius="md"
                bg={memberBg}
              >
                <HStack spacing={2}>
                  <Avatar name={memberEmail} size="xs" />
                  <Text fontSize="sm" color={textColor}>
                    {memberEmail}
                  </Text>
                </HStack>
                <Tooltip label="Remove Member">
                  <IconButton
                    aria-label="Remove member"
                    icon={<MinusIcon />}
                    colorScheme="red"
                    variant="ghost"
                    size="xs"
                    onClick={() => onDeleteMember(team._id, memberEmail)}
                  />
                </Tooltip>
              </Flex>
            ))}
          </VStack>
        ) : (
          <Text color="gray.500" fontSize="sm">
            No members yet.
          </Text>
        )}
        <Flex justify="end" mt={4}>
          <Tooltip label="Add Member">
            <IconButton
              aria-label="Add member"
              icon={<AddIcon />}
              colorScheme="green"
              size="sm"
              borderRadius="full"
              onClick={() => onAddMember(team._id)}
            />
          </Tooltip>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default TeamCard;
