"use client";

import {
  Box,
  Button,
  IconButton,
  Input,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  HStack,
  Spinner,
  Divider,
  Flex,
  Code,
  VStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
} from "@chakra-ui/react";
import { ChatIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { useCallback, useState, useRef, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiZap, FiPieChart, FiAlertCircle, FiUsers, FiTrash2 } from "react-icons/fi";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

interface CodeProps {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const promptChips = [
  { label: "My Pending Tasks", icon: FiZap, query: "What tasks are assigned to me across all projects?" },
  { label: "Project Summaries", icon: FiPieChart, query: "Give me a summary of all accessible projects, their statuses, and completions." },
  { label: "High Priority Issues", icon: FiAlertCircle, query: "List all high priority and overdue tasks in my workspace." },
  { label: "Team Members", icon: FiUsers, query: "List all teams I belong to and their members." },
];

export default function AIAssistant() {
  const { data: session } = useSession();
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<AIMessage[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = useColorModeValue("white", "gray.900");
  const onSurface = useColorModeValue("gray.800", "gray.100");
  const primary = useColorModeValue("blue.600", "blue.400");
  const onPrimary = useColorModeValue("white", "gray.900");
  const userBg = useColorModeValue("blue.50", "blue.900");
  const assistantBg = useColorModeValue("gray.50", "gray.800");
  const outline = useColorModeValue("gray.200", "gray.700");
  const codeBg = useColorModeValue("gray.100", "gray.800");

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation, isAiLoading]);

  const handleAskAI = useCallback(
    async (customPrompt?: string) => {
      const queryToSend = customPrompt || aiQuery;
      if (!queryToSend.trim()) return;

      setIsAiLoading(true);
      const userMessage: AIMessage = { role: "user", content: queryToSend };
      const updatedConversation = [...conversation, userMessage];

      setConversation(updatedConversation);
      if (!customPrompt) setAiQuery("");

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.id}`,
          },
          body: JSON.stringify({
            messages: updatedConversation,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || "Failed to get response from Gemini");
        }

        const data = await response.json();
        const assistantResponse = data?.response;

        if (assistantResponse) {
          const assistantMessage: AIMessage = {
            role: "assistant",
            content: assistantResponse,
          };
          setConversation((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error("Empty response from Gemini");
        }
      } catch (error) {
        console.error("Gemini error:", error);
        toast({
          title: "ZenFlow AI Error",
          description: (error as Error).message || "Failed to get response",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsAiLoading(false);
      }
    },
    [aiQuery, conversation, session, toast]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  const handleClearChat = () => {
    setConversation([]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <IconButton
        aria-label="ZenFlow AI Copilot"
        icon={<ChatIcon />}
        position="fixed"
        bottom="24px"
        right="24px"
        size="lg"
        borderRadius="full"
        colorScheme="blue"
        shadow="xl"
        zIndex="1000"
        onClick={onOpen}
        _hover={{ transform: "scale(1.08)", shadow: "2xl" }}
        transition="all 0.2s ease"
      />

      {/* RAG Chat Copilot Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay backdropFilter="blur(3px)" />
        <DrawerContent bg={surface} color={onSurface} shadow="2xl">
          {/* Header */}
          <DrawerHeader borderBottom="1px solid" borderColor={outline} p={4}>
            <Flex justify="space-between" align="center">
              <HStack spacing={2.5}>
                <Flex
                  w={7}
                  h={7}
                  bg="blue.500"
                  color="white"
                  borderRadius="lg"
                  align="center"
                  justify="center"
                >
                  <ChatIcon boxSize={3.5} />
                </Flex>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="md">
                    ZenFlow AI Copilot
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Workspace-aware RAG Assistant
                  </Text>
                </VStack>
              </HStack>

              <HStack spacing={1}>
                {conversation.length > 0 && (
                  <Tooltip label="Clear conversation">
                    <IconButton
                      aria-label="Clear chat"
                      icon={<FiTrash2 />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={handleClearChat}
                    />
                  </Tooltip>
                )}
                <DrawerCloseButton position="relative" top={0} right={0} />
              </HStack>
            </Flex>
          </DrawerHeader>

          {/* Chat Body */}
          <DrawerBody p={4} display="flex" flexDirection="column" ref={chatContainerRef}>
            {/* Quick Prompt Chips */}
            <Box mb={4}>
              <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} textTransform="uppercase">
                Quick Commands
              </Text>
              <Flex wrap="wrap" gap={2}>
                {promptChips.map((chip, idx) => (
                  <Tag
                    key={idx}
                    size="sm"
                    variant="subtle"
                    colorScheme="blue"
                    borderRadius="full"
                    cursor="pointer"
                    p={2}
                    _hover={{ bg: "blue.500", color: "white" }}
                    onClick={() => handleAskAI(chip.query)}
                  >
                    <TagLeftIcon as={chip.icon} />
                    <TagLabel fontSize="xs">{chip.label}</TagLabel>
                  </Tag>
                ))}
              </Flex>
            </Box>

            <Divider mb={4} borderColor={outline} />

            {/* Conversation Messages */}
            <VStack spacing={4} align="stretch" flex={1}>
              {conversation.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  h="240px"
                  color="gray.400"
                  textAlign="center"
                >
                  <ChatIcon boxSize={8} mb={3} color="blue.400" />
                  <Text fontWeight="semibold" fontSize="sm" color={onSurface}>
                    Ask ZenFlow AI anything about your workspace!
                  </Text>
                  <Text fontSize="xs" color="gray.500" maxW="300px" mt={1}>
                    I have full real-time knowledge of your projects, tasks, sprints, deadlines, and teams.
                  </Text>
                </Flex>
              ) : (
                conversation.map((msg, index) => (
                  <Box
                    key={index}
                    alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                    bg={msg.role === "user" ? userBg : assistantBg}
                    color={onSurface}
                    p={3.5}
                    borderRadius="2xl"
                    maxW="90%"
                    shadow="xs"
                    borderWidth="1px"
                    borderColor={outline}
                  >
                    <Text fontSize="xs" fontWeight="bold" color={msg.role === "user" ? "blue.500" : "purple.500"} mb={1}>
                      {msg.role === "user" ? "You" : "ZenFlow AI"}
                    </Text>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({
                          inline,
                          className,
                          children,
                          ...props
                        }: CodeProps) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <Box
                              borderRadius="md"
                              overflow="hidden"
                              my={2}
                              bg={codeBg}
                              p={2}
                            >
                              <SyntaxHighlighter
                                style={materialDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </Box>
                          ) : (
                            <Code
                              px={1.5}
                              py={0.5}
                              borderRadius="md"
                              bg={codeBg}
                              fontSize="xs"
                              {...props}
                            >
                              {children}
                            </Code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </Box>
                ))
              )}

              {isAiLoading && (
                <HStack alignSelf="flex-start" p={3} bg={assistantBg} borderRadius="xl">
                  <Spinner size="xs" color="blue.500" />
                  <Text fontSize="xs" color="gray.500">
                    ZenFlow AI is thinking...
                  </Text>
                </HStack>
              )}
            </VStack>
          </DrawerBody>

          {/* Input Footer */}
          <Box p={4} borderTop="1px solid" borderColor={outline} bg={surface}>
            <HStack spacing={2}>
              <Input
                ref={inputRef}
                placeholder="Ask about tasks, projects, sprints..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                borderRadius="full"
                size="sm"
                bg={assistantBg}
              />
              <Button
                colorScheme="blue"
                onClick={() => handleAskAI()}
                isLoading={isAiLoading}
                borderRadius="full"
                size="sm"
                px={5}
                isDisabled={!aiQuery.trim()}
              >
                Ask
              </Button>
            </HStack>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
}
