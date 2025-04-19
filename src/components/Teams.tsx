"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  useDisclosure,
  useToast,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
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
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.900", "gray.100");
  const buttonBg = useColorModeValue("blue.500", "blue.600");
  const buttonColor = useColorModeValue("white", "white");

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
        body: JSON.stringify({ name: teamName }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        setTeams([...teams, newTeam]);
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

  const inviteMember = async () => {
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
      const response = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: selectedTeamId,
          email: inviteEmail,
          invitedBy: session?.user?.email,
        }),
      });

      if (response.ok) {
        toast({ title: "Invitation sent successfully!", status: "success" });
      } else {
        const errorData = await response.json();
        toast({
          title: errorData.error || "Failed to send invitation.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({ title: "Failed to send invitation.", status: "error" });
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
        setTeams(teams.filter((team) => team._id !== teamId));
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
        const updatedTeam = await response.json();
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team._id === updatedTeam.team._id ? updatedTeam.team : team
          )
        );
        toast({ title: "Member deleted successfully.", status: "success" });
      } else {
        toast({ title: "Failed to delete member.", status: "error" });
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({ title: "Failed to delete member.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box h="90vh" p={6} bg={bg} borderRadius="xl">
      <VStack spacing={6} align="start">
        <Heading size="xl" fontWeight="semibold" color={headingColor}>
          Teams
        </Heading>
        <Text fontSize="lg" color={textColor} fontWeight="medium">
          Collaborate efficiently with your teams. Manage members and create new
          spaces.
        </Text>

        <Button
          leftIcon={<AddIcon />}
          onClick={() => {
            setSelectedTeamId(null);
            onOpen();
          }}
          size="lg"
          borderRadius="full"
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: useColorModeValue("blue.600", "blue.700") }}
          isLoading={isLoading}
          boxShadow="md"
        >
          Create New Team
        </Button>

        {teams.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={8}
            width="full"
          >
            {teams.map((team) => (
              <TeamCard
                key={team._id}
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
          <Text fontSize="xl" color="gray.500" mt={6}>
            No teams created yet. Start by creating one!
          </Text>
        )}
      </VStack>

      <TeamModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={selectedTeamId ? inviteMember : addTeam}
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
