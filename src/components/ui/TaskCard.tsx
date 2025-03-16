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
  useColorModeValue,
  Tooltip,
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
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputFocusBg = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const badgeColorSchemes = {
    High: "red",
    Medium: "yellow",
    Low: "green",
  };

  return (
    <Box
      bg={cardBg}
      p={4}
      borderRadius="xl"
      shadow="md"
      w="full"
      transition="all 0.2s"
      _hover={{ bg: hoverBg }}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      {isEditing ? (
        <>
          <Input
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            borderRadius="xl"
            bg={inputBg}
            border="none"
            _focus={{ bg: inputFocusBg }}
          />
          <Select
            value={editPriority}
            onChange={(e) =>
              onEditPriorityChange(e.target.value as Task["priority"])
            }
            borderRadius="xl"
            bg={inputBg}
            border="none"
            _focus={{ bg: inputFocusBg }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={onSaveEdit}
            borderRadius="full"
            boxShadow="md"
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <Text fontSize="md" fontWeight="semibold" color={textColor}>
            {task.title}
          </Text>
          <Badge
            colorScheme={badgeColorSchemes[task.priority]}
            borderRadius="full"
            px={2}
            py={1}
            variant="solid"
          >
            {task.priority} Priority
          </Badge>
          <Flex gap={2} mt={2}>
            <Tooltip label="Edit Task">
              <IconButton
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                aria-label="Edit Task"
                onClick={onStartEditing}
                borderRadius="full"
              />
            </Tooltip>
            <Tooltip label="Delete Task">
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                aria-label="Delete Task"
                onClick={onDeleteTask}
                borderRadius="full"
              />
            </Tooltip>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default TaskCard;