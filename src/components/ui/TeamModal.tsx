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
    const inputBg = useColorModeValue("gray.100", "gray.700");
    const inputColor = useColorModeValue("gray.200", "gray.600") ;
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" bg={modalBg} boxShadow="xl">
          <ModalHeader fontSize="2xl" fontWeight="semibold">
            {isAddingMember ? "Invite Member" : "Create Team"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isAddingMember ? (
              <FormControl mb={4}>
                <FormLabel>Member Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter member's email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  borderRadius="xl"
                  bg={inputBg}
                  border="none"
                  _focus={{ bg: inputColor}}
                />
              </FormControl>
            ) : (
              <FormControl mb={4}>
                <FormLabel>Team Name</FormLabel>
                <Input
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  borderRadius="xl"
                  bg={inputBg}
                  border="none"
                  _focus={{ bg: inputColor}} 
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onSubmit}
              borderRadius="full"
              boxShadow="md"
              isLoading={isLoading}
            >
              {isAddingMember ? "Send Invitation" : "Create"}
            </Button>
            <Button onClick={onClose} borderRadius="full" boxShadow="md">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default TeamModal;