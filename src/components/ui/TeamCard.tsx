"use client";

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
  Badge,
  Divider,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FiUsers, FiFolder } from "react-icons/fi";
import { Team } from "@/types/types";

type TeamCardProps = {
  team: Team & { projects?: { id: string; name: string; status: string }[] };
  onDeleteTeam: (teamId: string) => void;
  onAddMember: (teamId: string) => void;
  onDeleteMember: (teamId: string, memberId: string) => void;
};

const TeamCard = ({
  team,
  onDeleteTeam,
  onAddMember,
  onDeleteMember,
}: TeamCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const memberBg = useColorModeValue("gray.50", "gray.750");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.900", "gray.100");

  const memberCount = team.members ? team.members.length : 0;
  const projectCount = team.projects ? team.projects.length : 0;

  return (
    <Card
      borderRadius="2xl"
      bg={cardBg}
      borderWidth="1px"
      borderColor={cardBorder}
      shadow="sm"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ shadow: "md" }}
    >
      <CardHeader p={4} pb={2}>
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Avatar
              name={team.name}
              size="sm"
              bg="purple.500"
              color="white"
              borderRadius="lg"
            />
            <VStack align="start" spacing={0}>
              <Heading size="md" fontWeight="bold" color={headingColor}>
                {team.name}
              </Heading>
              <HStack spacing={2} fontSize="xs" color={subTextColor}>
                <Text>{memberCount} {memberCount === 1 ? "member" : "members"}</Text>
                <Text>•</Text>
                <Text>{projectCount} {projectCount === 1 ? "project" : "projects"}</Text>
              </HStack>
            </VStack>
          </HStack>

          <Tooltip label="Delete Team">
            <IconButton
              aria-label="Delete team"
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              size="sm"
              borderRadius="md"
              onClick={() => onDeleteTeam(team.id)}
            />
          </Tooltip>
        </Flex>
      </CardHeader>

      <CardBody p={4} pt={2}>
        {/* Assigned Projects Badges if any */}
        {team.projects && team.projects.length > 0 && (
          <VStack align="start" spacing={1.5} mb={3}>
            <Text fontSize="xs" fontWeight="bold" color={subTextColor} textTransform="uppercase">
              Assigned Projects
            </Text>
            <Flex wrap="wrap" gap={1.5}>
              {team.projects.map((proj) => (
                <Tag key={proj.id} size="sm" colorScheme="blue" borderRadius="full">
                  <TagLabel>{proj.name}</TagLabel>
                </Tag>
              ))}
            </Flex>
          </VStack>
        )}

        <Divider mb={3} borderColor={cardBorder} />

        {/* Member List */}
        <VStack align="stretch" spacing={2}>
          <Flex justify="space-between" align="center">
            <Text fontSize="xs" fontWeight="bold" color={subTextColor} textTransform="uppercase">
              Members
            </Text>
            <Tooltip label="Add Member">
              <IconButton
                aria-label="Add member"
                icon={<AddIcon boxSize={2.5} />}
                colorScheme="blue"
                size="xs"
                borderRadius="full"
                onClick={() => onAddMember(team.id)}
              />
            </Tooltip>
          </Flex>

          {team.members && team.members.length > 0 ? (
            team.members.map((member) => (
              <Flex
                key={member.id}
                align="center"
                justify="space-between"
                w="full"
                p={2}
                borderRadius="xl"
                bg={memberBg}
              >
                <HStack spacing={2.5} overflow="hidden">
                  <Avatar
                    name={member.user?.name ?? member.user?.email ?? "?"}
                    size="xs"
                  />
                  <VStack align="start" spacing={0} overflow="hidden">
                    <Text fontSize="xs" fontWeight="semibold" color={textColor} noOfLines={1}>
                      {member.user?.name || member.user?.email || "Unknown"}
                    </Text>
                    {member.user?.name && (
                      <Text fontSize="2xs" color={subTextColor} noOfLines={1}>
                        {member.user.email}
                      </Text>
                    )}
                  </VStack>
                </HStack>

                <HStack spacing={2}>
                  <Badge
                    colorScheme={member.role === "owner" ? "purple" : "gray"}
                    fontSize="2xs"
                    borderRadius="full"
                    px={2}
                  >
                    {member.role || "member"}
                  </Badge>

                  <Tooltip label="Remove Member">
                    <IconButton
                      aria-label="Remove member"
                      icon={<MinusIcon boxSize={2} />}
                      colorScheme="red"
                      variant="ghost"
                      size="xs"
                      borderRadius="md"
                      onClick={() => onDeleteMember(team.id, member.id)}
                    />
                  </Tooltip>
                </HStack>
              </Flex>
            ))
          ) : (
            <Text color={subTextColor} fontSize="xs" py={2} textAlign="center">
              No members in this team yet.
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default TeamCard;
