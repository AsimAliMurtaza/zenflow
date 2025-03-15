"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Card,
  CardHeader,
  CardBody,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Avatar,
  AvatarGroup,
  Tag,
  TagLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type Member = {
  _id: string;
  name: string;
  role?: string;
};

type Team = {
  _id: string;
  name: string;
  members: Member[];
};

const Teams = ({ teams: initialTeams }: { teams: Team[] }) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [teamName, setTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // Add New Team
  const addTeam = async () => {
    if (!teamName.trim()) {
      toast({ title: "Please enter a team name.", status: "warning" });
      return;
    }

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
  };

  // Add New Member
  const addMember = async () => {
    if (!selectedTeamId) {
      toast({ title: "Please select a team.", status: "warning" });
      return;
    }
    if (!newMemberName.trim()) {
      toast({ title: "Please enter member name.", status: "warning" });
      return;
    }

    const response = await fetch("/api/teams", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: selectedTeamId,
        name: newMemberName,
        role: newMemberRole,
      }),
    });

    if (response.ok) {
      const updatedTeam = await response.json();
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team._id === updatedTeam._id ? updatedTeam : team
        )
      );
      setNewMemberName("");
      setNewMemberRole("");
      onClose();
      toast({ title: "Member added successfully!", status: "success" });
    } else {
      toast({ title: "Failed to add member.", status: "error" });
    }
  };

  // Remove Team
  const removeTeam = async (teamId: string) => {
    const response = await fetch("/api/teams", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: teamId }),
    });

    if (response.ok) {
      setTeams(teams.filter((team) => team._id !== teamId));
      toast({ title: "Team deleted successfully.", status: "error" });
    } else {
      toast({ title: "Failed to delete team.", status: "error" });
    }
  };

  return (
    <Box p={8} bg={bgColor} color={textColor} borderRadius="lg">
      <Heading size="2xl" mb={6} fontWeight="bold">
        👥 Teams Management
      </Heading>
      <Text
        fontSize="lg"
        mb={8}
        color={useColorModeValue("gray.600", "gray.300")}
      >
        Manage your teams and add members.
      </Text>

      <Button
        colorScheme="blue"
        leftIcon={<AddIcon />}
        onClick={onOpen}
        mb={8}
        size="lg"
        borderRadius="full"
      >
        Create Team
      </Button>

      {/* Team Cards */}
      <VStack spacing={6} align="stretch">
        {teams.map((team) => (
          <Card key={team._id} shadow="lg" borderRadius="2xl" bg={cardBg}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="lg" fontWeight="semibold">
                  {team.name}
                </Heading>
                <IconButton
                  aria-label="Delete team"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeTeam(team._id)}
                />
              </HStack>
            </CardHeader>
            <CardBody>
              {team.members.length > 0 ? (
                <VStack align="start" spacing={4}>
                  {team.members.map((member) => (
                    <HStack key={member._id} justify="space-between" w="full">
                      <HStack>
                        <Avatar name={member.name} size="sm" />
                        <Text>{member.name}</Text>
                      </HStack>
                      <Tag colorScheme="blue" borderRadius="full">
                        <TagLabel>{member.role || "No Role"}</TagLabel>
                      </Tag>
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
                onClick={() => {
                  setSelectedTeamId(team._id);
                  onOpen();
                }}
              >
                Add Member
              </Button>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Modal Dialog for Adding Teams and Members */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader fontSize="2xl" fontWeight="bold">
            {selectedTeamId ? "Add Member" : "Create Team"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTeamId ? (
              <>
                <FormControl mb={4}>
                  <FormLabel>Member Name</FormLabel>
                  <Input
                    placeholder="Enter member name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Role (Optional)</FormLabel>
                  <Input
                    placeholder="Enter role"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    borderRadius="lg"
                  />
                </FormControl>
              </>
            ) : (
              <FormControl>
                <FormLabel>Team Name</FormLabel>
                <Input
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  borderRadius="lg"
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={selectedTeamId ? addMember : addTeam}
              borderRadius="full"
            >
              {selectedTeamId ? "Add Member" : "Create"}
            </Button>
            <Button onClick={onClose} borderRadius="full">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Teams;
