// components/ProjectModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { Team } from "@/types/types";

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  description: string;
  assignedTeam: string;
  dueDate: string;
  teams: Team[];
  onProjectNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAssignedTeamChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onSave: () => void;
  isEditing: boolean;
};

const ProjectModal = ({
  isOpen,
  onClose,
  projectName,
  description,
  assignedTeam,
  dueDate,
  teams,
  onProjectNameChange,
  onDescriptionChange,
  onAssignedTeamChange,
  onDueDateChange,
  onSave,
  isEditing,
}: ProjectModalProps) => {
  const modalBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="2xl" bg={modalBg} boxShadow="xl">
        <ModalHeader fontSize="2xl" fontWeight="semibold">
          {isEditing ? "Edit Project" : "Add Project"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Project Name</FormLabel>
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              borderRadius="xl"
              bg={inputBg}
              border="none"
              _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Input
              placeholder="Project Description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              borderRadius="xl"
              bg={inputBg}
              border="none"
              _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
            />
          </FormControl>

          {/* <FormControl mb={4}>
            <FormLabel>Status</FormLabel>
            <Select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
              borderRadius="xl"
              bg={inputBg}
              border="none"
              _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Almost Done">Almost Done</option>
            </Select>
          </FormControl> */}

          <FormControl mb={4}>
            <FormLabel>Assign Team</FormLabel>
            <Select
              placeholder="Assign Team"
              value={assignedTeam !== "" ? (assignedTeam as string) : "No teams found"}
              onChange={(e) => {
                const selectedTeam = teams.find(
                  (team) => team._id === e.target.value
                );
                if (selectedTeam) {

                  onAssignedTeamChange(selectedTeam._id);
                }
              }}
              borderRadius="xl"
              bg={inputBg}
              border="none"
              _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
            >
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              borderRadius="xl"
              bg={inputBg}
              border="none"
              _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={onSave}
            mr={3}
            borderRadius="full"
            boxShadow="md"
          >
            {isEditing ? "Update" : "Save"}
          </Button>
          <Button onClick={onClose} borderRadius="full" boxShadow="md">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectModal;