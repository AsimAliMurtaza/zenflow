"use client";

import { Team } from "@/types/types";
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
  Textarea,
  Select,
  Button,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskDescription: string;
  taskPriority: string;
  taskDueDate: string;
  taskAssignedTo: string;
  team?: Team | null;
  onTaskTitleChange: (value: string) => void;
  onTaskDescriptionChange: (value: string) => void;
  onTaskPriorityChange: (value: string) => void;
  onTaskDueDateChange: (value: string) => void;
  onTaskAssignedToChange: (value: string) => void;
  onAddTask: () => void;
  taskSprint: string;
  onTaskSprintChange: (value: string) => void;
  sprints: { id: string; name: string }[];
};

const AddTaskModal = ({
  isOpen,
  onClose,
  taskTitle,
  taskDescription,
  taskPriority,
  taskDueDate,
  taskAssignedTo,
  team,
  onTaskTitleChange,
  onTaskDescriptionChange,
  onTaskPriorityChange,
  onTaskDueDateChange,
  onTaskAssignedToChange,
  onAddTask,
  taskSprint,
  onTaskSprintChange,
  sprints,
}: AddTaskModalProps) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="2xl" shadow="2xl" overflow="hidden">
        <ModalHeader borderBottom="1px solid" borderColor={borderColor} p={4}>
          <HStack spacing={2}>
            <Badge colorScheme="blue" borderRadius="md" px={2} py={0.5}>
              Task
            </Badge>
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Create Issue
            </span>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top={3} right={3} />

        <ModalBody p={5}>
          <VStack spacing={4} align="stretch">
            {/* Issue Title / Summary */}
            <FormControl isRequired>
              <FormLabel fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.500">
                Summary *
              </FormLabel>
              <Input
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={(e) => onTaskTitleChange(e.target.value)}
                bg={inputBg}
                borderRadius="xl"
                size="md"
                fontWeight="medium"
              />
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.500">
                Description
              </FormLabel>
              <Textarea
                placeholder="Add more details about this task..."
                value={taskDescription}
                onChange={(e) => onTaskDescriptionChange(e.target.value)}
                bg={inputBg}
                borderRadius="xl"
                rows={3}
              />
            </FormControl>

            {/* Priority & Due Date */}
            <HStack spacing={4}>
              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.500">
                  Priority
                </FormLabel>
                <Select
                  value={taskPriority}
                  onChange={(e) => onTaskPriorityChange(e.target.value)}
                  bg={inputBg}
                  borderRadius="xl"
                  size="sm"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </Select>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.500">
                  Due Date
                </FormLabel>
                <Input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => onTaskDueDateChange(e.target.value)}
                  bg={inputBg}
                  borderRadius="xl"
                  size="sm"
                />
              </FormControl>
            </HStack>

            {/* Assignee & Sprint */}
            <HStack spacing={4}>
              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.500">
                  Assignee
                </FormLabel>
                <Select
                  placeholder="Unassigned"
                  value={taskAssignedTo}
                  onChange={(e) => onTaskAssignedToChange(e.target.value)}
                  bg={inputBg}
                  borderRadius="xl"
                  size="sm"
                >
                  {team && team.members && team.members.length > 0 ? (
                    team.members.map((member, index) => (
                      <option key={index} value={member.user?.email ?? ""}>
                        {member.user?.name ?? member.user?.email ?? "Unknown"}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No team members
                    </option>
                  )}
                </Select>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.500">
                  Sprint
                </FormLabel>
                <Select
                  placeholder="Backlog (No Sprint)"
                  value={taskSprint}
                  onChange={(e) => onTaskSprintChange(e.target.value)}
                  bg={inputBg}
                  borderRadius="xl"
                  size="sm"
                >
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter bg={inputBg} p={4} borderTop="1px solid" borderColor={borderColor}>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={onAddTask}
              size="sm"
              borderRadius="full"
              px={6}
              isDisabled={!taskTitle.trim()}
            >
              Create Issue
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
