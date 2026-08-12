"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  useToast,
  useColorModeValue,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Card,
  CardBody,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { FiUsers, FiFolder } from "react-icons/fi";
import TeamCard from "@/components/ui/TeamCard";
import TeamModal from "@/components/ui/TeamModal";
import { Team } from "@/types/types";
import { useSession } from "next-auth/react";

type TeamsProps = {
  teams: Team[];
};

const Teams = ({ teams: initialTeams }: TeamsProps) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [teamName, setTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  const addTeam = async () => {
    if (!teamName.trim()) {
      toast({ title: "Please enter a team name.", status: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          creatorId: session?.user?.id,
        }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        setTeams([newTeam, ...teams]);
        setTeamName("");
        onClose();
        toast({ title: "Team created successfully!", status: "success" });
      } else {
        toast({ title: "Failed to create team.", status: "error" });
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast({ title: "Failed to create team.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async () => {
    if (!selectedTeamId) {
      toast({ title: "Please select a team.", status: "warning" });
      return;
    }
    if (!inviteEmail.trim()) {
      toast({ title: "Please enter an email address.", status: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/teams/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: selectedTeamId,
          email: inviteEmail,
        }),
      });

      if (response.ok) {
        const updatedTeam = await response.json();
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === updatedTeam.id ? updatedTeam : team
          )
        );
        toast({ title: "Member added successfully!", status: "success" });
      } else {
        const errorData = await response.json();
        toast({
          title: errorData.error || "Failed to add member.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast({ title: "Failed to add member.", status: "error" });
    } finally {
      setIsLoading(false);
      setInviteEmail("");
      onClose();
    }
  };

  const deleteTeam = async (teamId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teamId }),
      });

      if (response.ok) {
        setTeams(teams.filter((team) => team.id !== teamId));
        toast({ title: "Team deleted successfully.", status: "success" });
      } else {
        toast({ title: "Failed to delete team.", status: "error" });
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({ title: "Failed to delete team.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async (teamId: string, memberId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/teams/delete-member", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, memberId }),
      });

      if (response.ok) {
        const resJson = await response.json();
        const updatedTeam = resJson.team;
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === updatedTeam.id ? updatedTeam : team
          )
        );
        toast({ title: "Member removed successfully.", status: "success" });
      } else {
        toast({ title: "Failed to remove member.", status: "error" });
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast({ title: "Failed to remove member.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Search filtering
  const filteredTeams = teams.filter((team) => {
    if (!searchQuery) return true;
    const nameMatch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    const memberMatch = team.members?.some(
      (m) =>
        m.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return nameMatch || memberMatch;
  });

  const totalMembers = teams.reduce(
    (acc, t) => acc + (t.members ? t.members.length : 0),
    0
  );

  return (
    <Box minH="100vh" p={{ base: 4, md: 8 }} bg={bg}>
      {/* Header Bar */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Box>
          <Heading size="xl" fontWeight="bold" color={textColor} mb={1}>
            Teams & Members
          </Heading>
          <Text fontSize="md" color={subTextColor}>
            Organize users into teams and assign them to active projects.
          </Text>
        </Box>

        <Button
          leftIcon={<AddIcon />}
          onClick={() => {
            setSelectedTeamId(null);
            onOpen();
          }}
          size="md"
          borderRadius="full"
          colorScheme="blue"
          px={6}
        >
          Create New Team
        </Button>
      </Flex>

      {/* Metrics Row */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>
        <Card bg={cardBg} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="sm">
          <CardBody p={5}>
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold" color={subTextColor} textTransform="uppercase">
                  Total Teams
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {teams.length}
                </Text>
              </VStack>
              <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="xl" align="center" justify="center">
                <Icon as={FiUsers} boxSize={5} />
              </Flex>
            </HStack>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderRadius="2xl" border="1px solid" borderColor={borderColor} shadow="sm">
          <CardBody p={5}>
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold" color={subTextColor} textTransform="uppercase">
                  Total Members
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {totalMembers}
                </Text>
              </VStack>
              <Flex w={10} h={10} bg="purple.50" color="purple.500" borderRadius="xl" align="center" justify="center">
                <Icon as={FiFolder} boxSize={5} />
              </Flex>
            </HStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Search Bar */}
      <Box p={3} bg={cardBg} borderRadius="2xl" border="1px solid" borderColor={borderColor} mb={6}>
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search teams by name or member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="xl"
          />
        </InputGroup>
      </Box>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="full">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDeleteTeam={deleteTeam}
              onAddMember={(teamId) => {
                setSelectedTeamId(teamId);
                onOpen();
              }}
              onDeleteMember={deleteMember}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Card p={10} textAlign="center" borderRadius="2xl" bg={cardBg} border="1px solid" borderColor={borderColor}>
          <Text fontSize="lg" fontWeight="semibold" color={subTextColor}>
            No teams found.
          </Text>
          <Text fontSize="sm" color={subTextColor} mt={1}>
            {searchQuery
              ? "Try adjusting your search query."
              : "Get started by creating your first team!"}
          </Text>
        </Card>
      )}

      {/* Create / Add Member Modal */}
      <TeamModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={selectedTeamId ? addMember : addTeam}
        isAddingMember={!!selectedTeamId}
        teamName={teamName}
        setTeamName={setTeamName}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Teams;
