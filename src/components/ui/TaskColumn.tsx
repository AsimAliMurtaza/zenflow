// components/TaskColumn.tsx
import { VStack, Heading, Button, Box } from "@chakra-ui/react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/types";

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
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <VStack
          ref={provided.innerRef}
          {...provided.droppableProps}
          bg="gray.50"
          p={4}
          w={{ base: "100%", md: "320px" }}
          minH="550px"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.300"
          shadow="lg"
          align="stretch"
          transition="all 0.3s"
        >
          <Heading
            size="md"
            mb={4}
            textAlign="center"
            color="blue.400"
            textTransform="uppercase"
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
          <Button mt={2} w="full" size="sm" onClick={onAddTask}>
            Add Task
          </Button>
        </VStack>
      )}
    </Droppable>
  );
};

export default TaskColumn;
