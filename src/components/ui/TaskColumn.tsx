// components/TaskColumn.tsx
import {
  VStack,
  Heading,
  Box,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/types";
import { AddIcon } from "@chakra-ui/icons";

type TaskColumnProps = {
  status: string;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  editingTaskId: string | null;
  editTitle: string;
  editPriority: Task["priority"];
  onEditTitleChange: (value: string) => void;
  onEditPriorityChange: (value: Task["priority"]) => void;
  onSaveEdit: () => void;
};

const TaskColumn = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  editingTaskId,
  editTitle,
  editPriority,
  onEditTitleChange,
  onEditPriorityChange,
  onSaveEdit,
}: TaskColumnProps) => {
  const columnBg = useColorModeValue("gray.100", "gray.700");
  const headingColor = useColorModeValue("blue.500", "blue.400");
  const buttonBg = useColorModeValue("blue.300", "gray.600");
  const buttonHoverBg = useColorModeValue("gray.300", "gray.500");
  const columnShadow = useColorModeValue("md", "md-dark");

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <VStack
          ref={provided.innerRef}
          {...provided.droppableProps}
          bg={columnBg}
          p={4}
          w={{ base: "100%", md: "320px" }}
          h="80vh"
          borderRadius="xl"
          shadow={columnShadow}
          align="stretch"
          overflowY={"auto"}
          transition="all 0.3s"
          spacing={3}
        >
          <Heading
            size="md"
            mb={4}
            textAlign="center"
            color={headingColor}
            textTransform="uppercase"
            fontWeight="semibold"
          >
            {status}
          </Heading>
          {tasks.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard
                    task={task}
                    isEditing={editingTaskId === task._id}
                    editTitle={editTitle}
                    editPriority={editPriority}
                    onEditTitleChange={onEditTitleChange}
                    onEditPriorityChange={onEditPriorityChange}
                    onSaveEdit={onSaveEdit}
                    onStartEditing={() => onEditTask(task._id)}
                    onDeleteTask={() => onDeleteTask(task._id)}
                  />
                </Box>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          <IconButton
            mt={2}
            aria-label="Add Task"
            w="30px"
            size="md"
            onClick={onAddTask}
            bg={buttonBg}
            _hover={{ bg: buttonHoverBg }}
            borderRadius="full"
            icon={<AddIcon />}
            boxShadow="md"
          />
        </VStack>
      )}
    </Droppable>
  );
};

export default TaskColumn;