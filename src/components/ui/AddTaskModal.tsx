// components/ui/AddTaskModal.tsx
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
} from "@chakra-ui/react";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskDescription: string;
  taskPriority: string;
  taskDueDate: string;
  taskAssignedTo: string;
  team: Team; // Replace `any` with a proper type (e.g., `TeamMember`)
  onTaskTitleChange: (value: string) => void;
  onTaskDescriptionChange: (value: string) => void;
  onTaskPriorityChange: (value: string) => void;
  onTaskDueDateChange: (value: string) => void;
  onTaskAssignedToChange: (value: string) => void;
  onAddTask: () => void;
  taskSprint: string;
  onTaskSprintChange: (value: string) => void;
  sprints: { _id: string; name: string }[]; // Replace with your actual sprint type
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
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => onTaskTitleChange(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Task description"
              value={taskDescription}
              onChange={(e) => onTaskDescriptionChange(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Priority</FormLabel>
            <Select
              value={taskPriority}
              onChange={(e) => onTaskPriorityChange(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              value={taskDueDate}
              onChange={(e) => onTaskDueDateChange(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Assigned To</FormLabel>
            <Select
              placeholder="Select a team member"
              value={taskAssignedTo}
              onChange={(e) => onTaskAssignedToChange(e.target.value)}
            >{(team !== void 0) && (team.members !== void 0) && team.members.map((member:string, index:number) => (
                <option key={index} value={member}>
                {member}
                </option>
              ))
            }
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Sprint</FormLabel>
            <Select
              placeholder="Select Sprint"
              value={taskSprint}
              onChange={(e) => onTaskSprintChange(e.target.value)}
            >
              {sprints.map((sprint) => (
                <option key={sprint._id} value={sprint._id}>
                  {sprint.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onAddTask}>
            Add Task
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
