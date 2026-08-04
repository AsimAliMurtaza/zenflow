"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Flex,
  Spinner,
  Center,
  useDisclosure,
  useColorModeValue,
  Box,
  HStack,
  Input,
  Select,
  Button,
  InputGroup,
  InputLeftElement,
  Avatar,
  AvatarGroup,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./ui/TaskColumn";
import AddTaskModal from "./ui/AddTaskModal";
import { TaskDetailModal } from "./ui/TaskDetailModal";
import { Task, TaskBoard, Team, Sprint } from "@/types/types";

interface KanbanBoardProps {
  onRefreshProject?: () => void;
}

const KanbanBoard = ({ onRefreshProject }: KanbanBoardProps) => {
  const { projectID } = useParams();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sprintFilter, setSprintFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStatus, setSelectedStatus] = useState<keyof TaskBoard>("To Do");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState("");
  const [team, setTeam] = useState<Team | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [taskSprint, setTaskSprint] = useState("");

  const boardBg = useColorModeValue("white", "gray.900");
  const filterBg = useColorModeValue("gray.50", "gray.800");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectID}/tasks`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setAllTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`/api/projects/${projectID}/team`);
        if (!response.ok) throw new Error("Failed to fetch team members");
        const teamData = await response.json();
        setTeam(teamData);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };
    fetchTeamMembers();
  }, [projectID]);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch(`/api/projects/${projectID}/sprints`);
        if (!response.ok) throw new Error("Failed to fetch sprints");
        const sprintData = await response.json();
        setSprints(sprintData);
      } catch (error) {
        console.error("Failed to fetch sprints:", error);
      }
    };
    fetchSprints();
  }, [projectID]);

  useEffect(() => {
    if (projectID) fetchTasks();
  }, [projectID]);

  // Apply filters
  const filteredTasks = allTasks.filter((task) => {
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(task.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (sprintFilter !== "all") {
      if (sprintFilter === "backlog") {
        if (task.sprintId) return false;
      } else if (task.sprintId !== sprintFilter) {
        return false;
      }
    }
    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }
    if (assigneeFilter !== "all") {
      const hasAssignee = task.assignees?.some(
        (a) => a.userEmail === assigneeFilter
      );
      if (!hasAssignee) return false;
    }
    return true;
  });

  const groupedTasks: TaskBoard = filteredTasks.reduce(
    (acc: TaskBoard, task: Task) => {
      const statusKey = (task.status || "To Do") as keyof TaskBoard;
      if (!acc[statusKey]) {
        acc[statusKey] = [];
      }
      acc[statusKey].push(task);
      return acc;
    },
    { "To Do": [], "In Progress": [], Completed: [] } as TaskBoard
  );

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceStatus = source.droppableId as keyof TaskBoard;
    const destStatus = destination.droppableId as keyof TaskBoard;

    const sourceList = [...groupedTasks[sourceStatus]];
    const destList = [...groupedTasks[destStatus]];

    const [movedTask] = sourceList.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destStatus };
    destList.splice(destination.index, 0, updatedTask);

    setAllTasks((prev) =>
      prev.map((t) => (t.id === movedTask.id ? updatedTask : t))
    );

    try {
      await fetch(`/api/projects/${projectID}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movedTask.id,
          status: destStatus,
          sprintId: movedTask.sprintId,
        }),
      });
      if (onRefreshProject) onRefreshProject();
    } catch (error) {
      console.error("Failed to update task status:", error);
      fetchTasks();
    }
  };

  const addTask = async (status: keyof TaskBoard) => {
    if (!taskTitle) return;

    try {
      const response = await fetch(`/api/projects/${projectID}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status,
          priority: taskPriority,
          dueDate: taskDueDate || undefined,
          assignedTo: taskAssignedTo ? [taskAssignedTo] : undefined,
          sprintId: taskSprint || undefined,
        }),
      });

      const resJson = await response.json();
      const createdTask = resJson.task || resJson;

      setAllTasks((prev) => [...prev, createdTask]);
      onClose();
      resetTaskForm();
      if (onRefreshProject) onRefreshProject();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("Medium");
    setTaskDueDate("");
    setTaskAssignedTo("");
    setTaskSprint("");
  };

  const handleUpdateTaskFromModal = async (updatedTask: Task) => {
    try {
      const res = await fetch(`/api/projects/${projectID}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          sprintId: updatedTask.sprintId,
          dueDate: updatedTask.dueDate,
          assignedTo: updatedTask.assignees
            ? updatedTask.assignees.map((a) => a.userEmail)
            : undefined,
        }),
      });
      if (!res.ok) throw new Error("Update failed");

      setAllTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      if (onRefreshProject) onRefreshProject();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTaskFromModal = async (taskId: string) => {
    try {
      await fetch(`/api/projects/${projectID}/tasks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });
      setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (onRefreshProject) onRefreshProject();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (loading) {
    return (
      <Center h="300px">
        <Spinner size="xl" thickness="3px" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box bg={boardBg} p={2} borderRadius="2xl">
      {/* Jira Board Header Control Bar */}
      <HStack
        mb={5}
        p={3}
        bg={filterBg}
        borderRadius="2xl"
        justify="space-between"
        flexWrap="wrap"
        spacing={4}
      >
        <HStack spacing={3} flex={1} flexWrap="wrap" minW="260px">
          {/* Search Box */}
          <InputGroup size="sm" maxW="220px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="xl"
              bg={boardBg}
            />
          </InputGroup>

          {/* Team Member Avatars Quick Filter */}
          {team && team.members && team.members.length > 0 && (
            <HStack spacing={1}>
              <Text fontSize="xs" color="gray.500" fontWeight="semibold" mr={1}>
                Assignees:
              </Text>
              <AvatarGroup size="xs" max={4}>
                {team.members.map((m) => {
                  const email = m.user?.email || "";
                  const isSelected = assigneeFilter === email;
                  return (
                    <Tooltip key={m.id} label={m.user?.name || email}>
                      <Avatar
                        name={m.user?.name || email}
                        size="xs"
                        cursor="pointer"
                        ring={isSelected ? "2px" : "0px"}
                        ringColor="blue.500"
                        onClick={() =>
                          setAssigneeFilter(isSelected ? "all" : email)
                        }
                      />
                    </Tooltip>
                  );
                })}
              </AvatarGroup>
              {assigneeFilter !== "all" && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => setAssigneeFilter("all")}
                >
                  Clear
                </Button>
              )}
            </HStack>
          )}

          {/* Sprint Filter */}
          <Select
            size="sm"
            value={sprintFilter}
            onChange={(e) => setSprintFilter(e.target.value)}
            w="160px"
            borderRadius="xl"
            bg={boardBg}
          >
            <option value="all">All Sprints</option>
            <option value="backlog">Backlog Only</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>

          {/* Priority Filter */}
          <Select
            size="sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            w="140px"
            borderRadius="xl"
            bg={boardBg}
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </HStack>

        {/* Create Issue Action Button */}
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          borderRadius="full"
          px={5}
          onClick={() => {
            setSelectedStatus("To Do");
            onOpen();
          }}
        >
          Create Issue
        </Button>
      </HStack>

      {/* Drag & Drop Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex gap={5} overflowX="auto" pb={4}>
          {(["To Do", "In Progress", "Completed"] as const).map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={groupedTasks[status] || []}
              onAddTask={() => {
                setSelectedStatus(status);
                onOpen();
              }}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setIsDetailOpen(true);
              }}
            />
          ))}
        </Flex>
      </DragDropContext>

      {/* Add Task Modal — UNCONDITIONAL render so onOpen works reliably */}
      <AddTaskModal
        isOpen={isOpen}
        onClose={onClose}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        taskPriority={taskPriority}
        taskDueDate={taskDueDate}
        taskAssignedTo={taskAssignedTo}
        team={team}
        onTaskTitleChange={setTaskTitle}
        onTaskDescriptionChange={setTaskDescription}
        onTaskPriorityChange={(value: string) =>
          setTaskPriority(value as Task["priority"])
        }
        onTaskDueDateChange={setTaskDueDate}
        onTaskAssignedToChange={setTaskAssignedTo}
        onAddTask={() => addTask(selectedStatus)}
        taskSprint={taskSprint}
        onTaskSprintChange={setTaskSprint}
        sprints={sprints}
      />

      {/* Task Detail Inspector Modal */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        sprints={sprints}
        team={team}
        onUpdateTask={handleUpdateTaskFromModal}
        onDeleteTask={handleDeleteTaskFromModal}
      />
    </Box>
  );
};

export default KanbanBoard;
