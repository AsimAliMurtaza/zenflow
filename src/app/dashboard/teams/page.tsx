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
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type Member = {
  id: string;
  name: string;
  role?: string;
};

type Team = {
  id: string;
  name: string;
  members: Member[];
};

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Add New Team
  const addTeam = () => {
    if (!teamName.trim()) {
      toast({ title: "Please enter a team name.", status: "warning" });
      return;
    }
    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName,
      members: [],
    };
    setTeams([...teams, newTeam]);
    setTeamName("");
    onClose();
    toast({ title: "Team created successfully!", status: "success" });
  };

  // Add New Member
  const addMember = () => {
    if (!selectedTeamId) {
      toast({ title: "Please select a team.", status: "warning" });
      return;
    }
    if (!newMemberName.trim()) {
      toast({ title: "Please enter member name.", status: "warning" });
      return;
    }
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === selectedTeamId
          ? {
              ...team,
              members: [...team.members, { id: Date.now().toString(), name: newMemberName, role: newMemberRole }],
            }
          : team
      )
    );
    setNewMemberName("");
    setNewMemberRole("");
    onClose();
    toast({ title: "Member added successfully!", status: "success" });
  };

  // Remove Team
  const removeTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId));
    toast({ title: "Team deleted successfully.", status: "error" });
  };

  return (
    <Box p={6}>
      <Heading size="xl" mb={4}>
        👥 Teams Management
      </Heading>
      <Text fontSize="lg" mb={4}>
        Manage your teams and add members.
      </Text>

      <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={onOpen} mb={6}>
        Create Team
      </Button>

      {/* Team Cards */}
      <VStack spacing={4} align="stretch">
        {teams.map((team) => (
          <Card key={team.id} shadow="md">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">{team.name}</Heading>
                <IconButton
                  aria-label="Delete team"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => removeTeam(team.id)}
                />
              </HStack>
            </CardHeader>
            <CardBody>
              {team.members.length > 0 ? (
                team.members.map((member) => (
                  <HStack key={member.id} justify="space-between">
                    <Text>{member.name}</Text>
                    <Text color="gray.500">{member.role || "No Role"}</Text>
                  </HStack>
                ))
              ) : (
                <Text color="gray.500">No members yet</Text>
              )}
              <Button
                mt={4}
                colorScheme="green"
                size="sm"
                onClick={() => {
                  setSelectedTeamId(team.id);
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
        <ModalContent>
          <ModalHeader>{selectedTeamId ? "Add Member" : "Create Team"}</ModalHeader>
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
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Role (Optional)</FormLabel>
                  <Input
                    placeholder="Enter role"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
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
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={selectedTeamId ? addMember : addTeam}>
              {selectedTeamId ? "Add Member" : "Create"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Teams;
