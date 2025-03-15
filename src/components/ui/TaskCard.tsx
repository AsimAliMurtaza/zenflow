// components/TaskCard.tsx
import {
  Box,
  Text,
  Badge,
  Flex,
  IconButton,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Task } from "@/types/types";

type TaskCardProps = {
  task: Task;
  isEditing: boolean;
  editTitle: string;
  editPriority: Task["priority"];
  onEditTitleChange: (value: string) => void;
  onEditPriorityChange: (value: Task["priority"]) => void;
  onSaveEdit: () => void;
  onStartEditing: () => void;
  onDeleteTask: () => void;
};

const TaskCard = ({
  task,
  isEditing,
  editTitle,
  editPriority,
  onEditTitleChange,
  onEditPriorityChange,
  onSaveEdit,
  onStartEditing,
  onDeleteTask,
}: TaskCardProps) => {
  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      shadow="md"
      w="full"
      transition="all 0.2s"
      _hover={{ bg: "gray.50" }}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      {isEditing ? (
        <>
          <Input
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
          />
          <Select
            value={editPriority}
            onChange={(e) =>
              onEditPriorityChange(e.target.value as Task["priority"])
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          <Button size="sm" variant="outline" onClick={onSaveEdit}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Text fontSize="md" fontWeight="bold" color="gray.800">
            {task.title}
          </Text>
          <Badge
            colorScheme={
              task.priority === "High"
                ? "red"
                : task.priority === "Medium"
                ? "yellow"
                : "green"
            }
          >
            {task.priority} Priority
          </Badge>
          <Flex gap={2} mt={2}>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              aria-label="Edit Task"
              onClick={onStartEditing}
            />
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              aria-label="Delete Task"
              onClick={onDeleteTask}
            />
          </Flex>
        </>
      )}
    </Box>
  );
};

export default TaskCard;
