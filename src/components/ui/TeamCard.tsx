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
    Tag,
    TagLabel,
    Button,
    useColorModeValue,
    Tooltip,
  } from "@chakra-ui/react";
  import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
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
  
    return (
      <Card shadow="xl" borderRadius="2xl" bg={cardBg}>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="lg" fontWeight="semibold">
              {team.name}
            </Heading>
            <Tooltip label="Delete Team">
              <IconButton
                aria-label="Delete team"
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                onClick={() => onDeleteTeam(team._id)}
              />
            </Tooltip>
          </HStack>
        </CardHeader>
        <CardBody>
          {team.members && team.members.length > 0 ? (
            <VStack align="start" spacing={4}>
              {team.members.map((memberEmail: string, index: number) => (
                <HStack
                  key={index}
                  justify="space-between"
                  w="full"
                  p={2}
                  borderRadius="lg"
                  bg={memberBg}
                >
                  <HStack>
                    <Avatar name={memberEmail} size="sm" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{memberEmail}</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <Tag colorScheme="blue" borderRadius="full" size="sm">
                      <TagLabel>Member</TagLabel>
                    </Tag>
                    <Tooltip label="Delete Member">
                      <IconButton
                        aria-label="Delete member"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteMember(team._id, memberEmail)}
                      />
                    </Tooltip>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">No members yet</Text>
          )}
          <Button
            mt={4}
            colorScheme="green"
            size="sm"
            borderRadius="full"
            onClick={() => onAddMember(team._id)}
            leftIcon={<AddIcon />}
            boxShadow="md"
          >
            Add Member
          </Button>
        </CardBody>
      </Card>
    );
  };
  
  export default TeamCard;