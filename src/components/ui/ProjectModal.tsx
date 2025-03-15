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
} from "@chakra-ui/react";
import { Team } from "@/types/types";

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  description: string;
  status: string;
  assignedTeam: string;
  dueDate: string;
  teams: Team[];
  onProjectNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
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
  status,
  assignedTeam,
  dueDate,
  teams,
  onProjectNameChange,
  onDescriptionChange,
  onStatusChange,
  onAssignedTeamChange,
  onDueDateChange,
  onSave,
  isEditing,
}: ProjectModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalHeader fontSize="2xl" fontWeight="bold">
          {isEditing ? "Edit Project" : "Add Project"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            mb={4}
            borderRadius="lg"
          />
          <Input
            placeholder="Project Description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            mb={4}
            borderRadius="lg"
          />
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            mb={4}
            borderRadius="lg"
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Almost Done">Almost Done</option>
          </Select>
          <Select
            placeholder="Assign Team"
            value={assignedTeam}
            onChange={(e) => onAssignedTeamChange(e.target.value)}
            mb={4}
            borderRadius="lg"
          >
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            mb={4}
            borderRadius="lg"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={onSave}
            mr={3}
            borderRadius="full"
          >
            {isEditing ? "Update" : "Save"}
          </Button>
          <Button onClick={onClose} borderRadius="full">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectModal;
