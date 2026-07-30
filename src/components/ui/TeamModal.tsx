"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Text,
  VStack,
} from "@chakra-ui/react";

type TeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isAddingMember: boolean;
  teamName: string;
  setTeamName: (value: string) => void;
  inviteEmail: string;
  setInviteEmail: (value: string) => void;
  isLoading?: boolean;
};

const TeamModal = ({
  isOpen,
  onClose,
  onSubmit,
  isAddingMember,
  teamName,
  setTeamName,
  inviteEmail,
  setInviteEmail,
  isLoading,
}: TeamModalProps) => {
  const modalBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" bg={modalBg} shadow="2xl" overflow="hidden">
        <ModalHeader fontSize="xl" fontWeight="bold" borderBottom="1px solid" borderColor={borderColor} p={4}>
          {isAddingMember ? "Add Team Member" : "Create New Team"}
        </ModalHeader>
        <ModalCloseButton top={3} right={3} />
        <ModalBody p={5}>
          {isAddingMember ? (
            <VStack align="stretch" spacing={3}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  User Email Address
                </FormLabel>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  borderRadius="xl"
                  bg={inputBg}
                />
              </FormControl>
              <Text fontSize="xs" color="gray.500">
                Enter the email address of the team member to add or invite them to this team workspace.
              </Text>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={3}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Team Name
                </FormLabel>
                <Input
                  placeholder="e.g. Frontend Engineering, Product Design"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  borderRadius="xl"
                  bg={inputBg}
                />
              </FormControl>
              <Text fontSize="xs" color="gray.500">
                Teams organize users and allow assigning shared project permissions and tasks.
              </Text>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter bg={inputBg} borderTop="1px solid" borderColor={borderColor} p={4}>
          <Button variant="ghost" onClick={onClose} size="sm" mr={2}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={onSubmit}
            borderRadius="full"
            px={6}
            size="sm"
            isLoading={isLoading}
            isDisabled={isAddingMember ? !inviteEmail.trim() : !teamName.trim()}
          >
            {isAddingMember ? "Add Member" : "Create Team"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamModal;