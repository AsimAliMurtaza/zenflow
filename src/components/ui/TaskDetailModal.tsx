"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  HStack,
  VStack,
  Badge,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  useColorModeValue,
  useToast,
  Divider,
  Checkbox,
  Progress,
  Box,
  Flex,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { Task, TaskPriority, TaskStatus, Sprint, Team, Subtask, Comment } from "@/types/types";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  sprints: Sprint[];
  team?: Team | null;
  onUpdateTask: (updatedTask: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  sprints,
  team,
  onUpdateTask,
  onDeleteTask,
}: TaskDetailModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [sprintId, setSprintId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedEmails, setAssignedEmails] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Subtasks & Comments State
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const toast = useToast();

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const fetchTaskDetails = async (taskId: string) => {
    try {
      const [subRes, comRes] = await Promise.all([
        fetch(`/api/tasks/${taskId}/subtasks`),
        fetch(`/api/tasks/${taskId}/comments`),
      ]);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubtasks(subData);
      }
      if (comRes.ok) {
        const comData = await comRes.json();
        setComments(comData);
      }
    } catch (err) {
      console.error("Error fetching subtasks/comments:", err);
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "To Do");
      setPriority(task.priority || "Medium");
      setSprintId(task.sprintId || "");
      setDueDate(
        task.dueDate
          ? typeof task.dueDate === "string"
            ? task.dueDate.split("T")[0]
            : new Date(task.dueDate).toISOString().split("T")[0]
          : ""
      );
      setAssignedEmails(
        task.assignees ? task.assignees.map((a) => a.userEmail) : []
      );
      setSubtasks(task.subtasks || []);
      setComments(task.comments || []);
      fetchTaskDetails(task.id);
    }
  }, [task]);

  if (!task) return null;

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSubtaskTitle }),
      });
      if (res.ok) {
        const created = await res.json();
        setSubtasks((prev) => [...prev, created]);
        setNewSubtaskTitle("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, isCompleted: boolean) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === subtaskId ? { ...st, isCompleted } : st))
    );
    try {
      await fetch(`/api/tasks/${task.id}/subtasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtaskId, isCompleted }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== subtaskId));
    try {
      await fetch(`/api/tasks/${task.id}/subtasks?subtaskId=${subtaskId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newCommentText }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [...prev, created]);
        setNewCommentText("");
      } else {
        toast({ title: "Failed to post comment", status: "error", duration: 3000 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    try {
      await fetch(`/api/tasks/${task.id}/comments?commentId=${commentId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAssignee = (email: string) => {
    if (assignedEmails.includes(email)) {
      setAssignedEmails(assignedEmails.filter((e) => e !== email));
    } else {
      setAssignedEmails([...assignedEmails, email]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", status: "warning", duration: 3000 });
      return;
    }
    setIsSaving(true);
    try {
      const updated: Task = {
        ...task,
        title,
        description,
        status,
        priority,
        sprintId,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignees: assignedEmails.map((email) => ({
          id: "",
          taskId: task.id,
          userEmail: email,
        })),
      };
      await onUpdateTask(updated);
      toast({ title: "Task updated successfully", status: "success", duration: 3000 });
      onClose();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to update task", status: "error", duration: 3000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteTask(task.id);
      toast({ title: "Task deleted", status: "info", duration: 3000 });
      onClose();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete task", status: "error", duration: 3000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityColors: Record<TaskPriority, string> = {
    Low: "gray",
    Medium: "blue",
    High: "red",
  };

  const statusColors: Record<TaskStatus, string> = {
    "To Do": "purple",
    "In Progress": "amber",
    Completed: "green",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="2xl" shadow="2xl" overflow="hidden">
        <ModalHeader borderBottom="1px solid" borderColor={borderColor} p={5}>
          <HStack justify="space-between" align="center" pr={8}>
            <Text fontSize="lg" fontWeight="bold">
              Task Details
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme={priorityColors[priority]} px={3} py={1} borderRadius="full">
                {priority} Priority
              </Badge>
              <Badge colorScheme={statusColors[status] || "blue"} px={3} py={1} borderRadius="full">
                {status}
              </Badge>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        <ModalBody p={6}>
          <VStack spacing={5} align="stretch">
            {/* Title */}
            <FormControl isRequired>
              <FormLabel fontWeight="semibold" fontSize="sm">
                Title
              </FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                bg={inputBg}
                borderRadius="xl"
                size="lg"
                fontWeight="semibold"
              />
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">
                Description
              </FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a detailed description..."
                bg={inputBg}
                borderRadius="xl"
                rows={4}
              />
            </FormControl>

            {/* Status & Priority Row */}
            <HStack spacing={4} align="top">
              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Status
                </FormLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  bg={inputBg}
                  borderRadius="xl"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Priority
                </FormLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  bg={inputBg}
                  borderRadius="xl"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </FormControl>
            </HStack>

            {/* Sprint & Due Date Row */}
            <HStack spacing={4} align="top">
              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Sprint
                </FormLabel>
                <Select
                  value={sprintId}
                  onChange={(e) => setSprintId(e.target.value)}
                  bg={inputBg}
                  borderRadius="xl"
                >
                  <option value="">No Sprint (Backlog)</option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Due Date
                </FormLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  bg={inputBg}
                  borderRadius="xl"
                />
              </FormControl>
            </HStack>

            <Divider borderColor={borderColor} />

            {/* Assignees Selection */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">
                Assignees
              </FormLabel>
              {team && team.members && team.members.length > 0 ? (
                <VStack align="stretch" spacing={2}>
                  <Wrap spacing={2}>
                    {team.members.map((member) => {
                      const email = member.user?.email ?? "";
                      const isAssigned = assignedEmails.includes(email);
                      return (
                        <WrapItem key={member.id}>
                          <Tag
                            size="md"
                            variant={isAssigned ? "solid" : "outline"}
                            colorScheme={isAssigned ? "blue" : "gray"}
                            cursor="pointer"
                            borderRadius="full"
                            onClick={() => handleToggleAssignee(email)}
                            p={2}
                          >
                            <TagLabel>{member.user?.name || email}</TagLabel>
                            {isAssigned && <TagCloseButton />}
                          </Tag>
                        </WrapItem>
                      );
                    })}
                  </Wrap>
                </VStack>
              ) : (
                <Text fontSize="xs" color="gray.500">
                  No team members assigned to project team.
                </Text>
              )}
            </FormControl>

            <Divider borderColor={borderColor} />

            {/* Subtasks / Checklist Section */}
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="semibold" fontSize="sm">
                  Subtasks & Checklist
                </Text>
                {subtasks.length > 0 && (
                  <Text fontSize="xs" color="blue.500" fontWeight="bold">
                    {Math.round((subtasks.filter((s) => s.isCompleted).length / subtasks.length) * 100)}% Done ({subtasks.filter((s) => s.isCompleted).length}/{subtasks.length})
                  </Text>
                )}
              </Flex>

              {/* Progress bar */}
              {subtasks.length > 0 && (
                <Progress
                  value={Math.round((subtasks.filter((s) => s.isCompleted).length / subtasks.length) * 100)}
                  size="xs"
                  colorScheme="blue"
                  borderRadius="full"
                />
              )}

              {/* Checklist items */}
              <VStack align="stretch" spacing={2}>
                {subtasks.map((st) => (
                  <HStack key={st.id} justify="space-between" bg={inputBg} p={2} borderRadius="lg">
                    <Checkbox
                      isChecked={st.isCompleted}
                      onChange={(e) => handleToggleSubtask(st.id, e.target.checked)}
                      colorScheme="blue"
                    >
                      <Text
                        fontSize="sm"
                        textDecoration={st.isCompleted ? "line-through" : "none"}
                        color={st.isCompleted ? "gray.500" : "inherit"}
                      >
                        {st.title}
                      </Text>
                    </Checkbox>
                    <IconButton
                      aria-label="Delete subtask"
                      icon={<FiTrash2 />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteSubtask(st.id)}
                    />
                  </HStack>
                ))}
              </VStack>

              {/* Add subtask input */}
              <HStack>
                <Input
                  placeholder="Add a subtask item..."
                  size="sm"
                  borderRadius="xl"
                  bg={inputBg}
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <Button size="sm" colorScheme="blue" borderRadius="xl" onClick={handleAddSubtask}>
                  Add
                </Button>
              </HStack>
            </VStack>

            <Divider borderColor={borderColor} />

            {/* Comments & Discussion Feed */}
            <VStack align="stretch" spacing={3}>
              <Text fontWeight="semibold" fontSize="sm">
                Discussion & Comments ({comments.length})
              </Text>

              {/* Comments list */}
              <VStack align="stretch" spacing={3} maxH="220px" overflowY="auto" pr={1}>
                {comments.length === 0 ? (
                  <Text fontSize="xs" color="gray.500" fontStyle="italic">
                    No comments yet. Start the discussion below.
                  </Text>
                ) : (
                  comments.map((c) => (
                    <Box key={c.id} bg={inputBg} p={3} borderRadius="xl">
                      <Flex justify="space-between" align="center" mb={1}>
                        <HStack spacing={2}>
                          <Avatar name={c.user?.name || c.user?.email || "User"} size="xs" />
                          <Text fontSize="xs" fontWeight="bold">
                            {c.user?.name || c.user?.email || "User"}
                          </Text>
                          <Text fontSize="10px" color="gray.500">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </Text>
                        </HStack>
                        <IconButton
                          aria-label="Delete comment"
                          icon={<FiTrash2 />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteComment(c.id)}
                        />
                      </Flex>
                      <Text fontSize="xs" color={textColor} pl={7}>
                        {c.content}
                      </Text>
                    </Box>
                  ))
                )}
              </VStack>

              {/* Post comment input */}
              <HStack align="top">
                <Textarea
                  placeholder="Write a comment..."
                  size="sm"
                  rows={2}
                  borderRadius="xl"
                  bg={inputBg}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <Button
                  colorScheme="blue"
                  size="sm"
                  borderRadius="xl"
                  h="auto"
                  py={3}
                  isLoading={isPostingComment}
                  onClick={handleAddComment}
                >
                  Post
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter bg={inputBg} p={4} borderTop="1px solid" borderColor={borderColor}>
          <HStack justify="space-between" w="full">
            <Button
              colorScheme="red"
              variant="ghost"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete Task
            </Button>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                borderRadius="full"
                px={6}
                isLoading={isSaving}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </HStack>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
