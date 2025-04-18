"use client";

import {
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  HStack,
  Spinner,
  Divider,
  Flex,
  Code,
  UseToastOptions,
  VStack,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useCallback, useState, useRef, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

export default function AIAssistant() {
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<AIMessage[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Material You inspired color scheme (adapt as needed)
  const surface = useColorModeValue("white", "gray.900");
  const onSurface = useColorModeValue("gray.800", "gray.100");
  const primary = useColorModeValue("blue.600", "blue.400");
  const onPrimary = useColorModeValue("white", "gray.900");
  const secondary = useColorModeValue("blue.100", "blue.700");
  const onSecondary = useColorModeValue("blue.800", "blue.200");
  const outline = useColorModeValue("gray.300", "gray.700");
  const codeBg = useColorModeValue("gray.100", "gray.800");

  // Scroll to bottom of chat on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleAskAI = useCallback(async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    const userMessage: AIMessage = { role: "user", content: aiQuery };
    setConversation((prev) => [...prev, userMessage]);
    setAiQuery("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiQuery,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error || "Failed to get response from Gemini"
        );
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
      const toastOptions: UseToastOptions = {
        title: "Gemini Error",
        description:
          (error as Error).message || "Failed to get response from Gemini",
        status: "error",
        duration: 3000,
        isClosable: true,
      };
      toast(toastOptions);
    } finally {
      setIsAiLoading(false);
    }
  }, [aiQuery, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in input
      handleAskAI();
    }
  };

  const handleOpenModal = () => {
    onOpen();
    // Focus on the input when the modal opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <>
      {/* Floating Action Button */}
      <IconButton
        aria-label="AI Assistant"
        icon={<ChatIcon />}
        position="fixed"
        bottom="24px"
        right="24px"
        size="lg"
        borderRadius="full"
        colorScheme="blue"
        boxShadow="md"
        zIndex="overlay"
        onClick={handleOpenModal}
        _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
        transition="all 0.2s"
      />

      {/* Chat Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          position="fixed"
          bottom={0}
          left="100v"
          right={0}
          m={4}
          borderRadius="xl"
          maxH="80vh"
          display="flex"
          flexDirection="column"
          bg={surface}
          color={onSurface}
          boxShadow="xl"
        >
          <ModalHeader
            p={4}
            borderBottom="1px"
            borderColor={outline}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack>
              <ChatIcon color={primary} mr={2} />
              <Text fontWeight="medium">ZenFlow AI</Text>
              <Text fontSize="sm" color="gray.500">
                (Powered by Gemini)
              </Text>
            </HStack>
            <ModalCloseButton aria-label="Close chat" />
          </ModalHeader>
          <ModalBody p={4} flexGrow={1} overflowY="auto" ref={chatContainerRef}>
            <VStack spacing={4} align="stretch">
              {conversation.length === 0 ? (
                <Flex
                  align="center"
                  justify="center"
                  h="full"
                  color="gray.500"
                  textAlign="center"
                >
                  <Text>Ask ZenFlow a question...</Text>
                </Flex>
              ) : (
                conversation.map((msg, index) => (
                  <Box
                    key={index}
                    alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                    bg={msg.role === "user" ? secondary : surface}
                    color={msg.role === "user" ? onSecondary : onSurface}
                    p={4}
                    borderRadius="lg"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor={outline}
                  >
                    <Text fontWeight="medium" mb={1}>
                      {msg.role === "user" ? "You" : "ZenFlow AI"}
                    </Text>
                    <Divider mb={2} borderColor={outline} opacity={0.5} />
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
                              color={onSurface}
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
                              px={2}
                              py={1}
                              borderRadius="md"
                              bg={codeBg}
                              color={onSurface}
                              fontSize="sm"
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
                <HStack alignSelf="flex-start" p={3}>
                  <Spinner size="sm" color={primary} />
                  <Text color="gray.500">Generating response...</Text>
                </HStack>
              )}
            </VStack>
          </ModalBody>
          <Box p={4} borderTop="1px solid" borderColor={outline}>
            <HStack spacing={3}>
              <Input
                ref={inputRef}
                placeholder="Ask something..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                bg={surface}
                color={onSurface}
                borderRadius="full"
                border="1px solid"
                borderColor={outline}
                _focus={{
                  borderColor: primary,
                  boxShadow: `0 0 0 1px ${primary}`,
                }}
              />
              <Button
                colorScheme="blue"
                onClick={handleAskAI}
                isLoading={isAiLoading}
                borderRadius="full"
                px={6}
                bg={primary}
                color={onPrimary}
                _hover={{ bg: useColorModeValue("blue.700", "blue.500") }}
              >
                Ask
              </Button>
            </HStack>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
