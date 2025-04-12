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

  // Color scheme
  const assistantBg = useColorModeValue("white", "gray.800");
  const userBg = useColorModeValue("blue.50", "blue.900");
  const assistantText = useColorModeValue("gray.800", "gray.100");
  const userText = useColorModeValue("blue.800", "blue.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("white", "gray.700");
    const codeColor = useColorModeValue("gray.100", "gray.700");
    

  // Scroll to bottom of chat on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleAskAI = useCallback(async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    const userMessage: AIMessage = { role: "user", content: aiQuery };
    setConversation((prev) => [...prev, userMessage]);
    setAiQuery("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...conversation, userMessage],
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantMessage: AIMessage = { role: "assistant", content: "" };
      setConversation((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage = {
          ...assistantMessage,
          content: assistantMessage.content + chunk,
        };

        setConversation((prev) => {
          const newConv = [...prev];
          newConv[newConv.length - 1] = assistantMessage;
          return newConv;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      const toastOptions: UseToastOptions = {
        title: "AI Error",
        description: "Failed to get response from assistant",
        status: "error",
        duration: 3000,
        isClosable: true,
      };
      toast(toastOptions);
    } finally {
      setIsAiLoading(false);
    }
  }, [aiQuery, conversation, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAskAI();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <IconButton
        aria-label="AI Assistant"
        icon={<ChatIcon />}
        position="fixed"
        bottom="40px"
        right="40px"
        size="lg"
        borderRadius="full"
        colorScheme="blue"
        boxShadow="lg"
        zIndex="overlay"
        onClick={onOpen}
        _hover={{ transform: "scale(1.1)" }}
        transition="all 0.2s"
      />

      {/* Chat Modal - Positioned on right side */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          position="fixed"
          right={["20px", "40px"]}
          bottom={["20px", "40px"]}
          top={["20px", "auto"]}
          left="auto"
          margin="0"
          borderRadius="xl"
          maxH={["calc(100vh - 40px)", "70vh"]}
          minW={["calc(100vw - 40px)", "400px"]}
          maxW="500px"
          display="flex"
          flexDirection="column"
        >
          <ModalHeader
            bg={assistantBg}
            borderTopRadius="xl"
            borderBottom="1px"
            borderColor={borderColor}
            display="flex"
            alignItems="center"
          >
            <HStack>
              <ChatIcon color="blue.500" />
              <Text fontWeight="semibold">ZenFlow AI</Text>
            </HStack>
            <ModalCloseButton position="absolute" right="12px" top="12px" />
          </ModalHeader>
          <ModalBody
            p={0}
            display="flex"
            flexDirection="column"
            flex="1"
            overflow="hidden"
          >
            <Flex
              direction="column"
              h="full"
              p={4}
              overflowY="auto"
              ref={chatContainerRef}
            >
              {conversation.length === 0 ? (
                <Flex
                  align="center"
                  justify="center"
                  h="full"
                  color="gray.500"
                  textAlign="center"
                >
                  <Text>Ask ZenFlow AI...</Text>
                </Flex>
              ) : (
                conversation.map((msg, index) => (
                  <Box
                    key={index}
                    alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                    bg={msg.role === "user" ? userBg : assistantBg}
                    color={msg.role === "user" ? userText : assistantText}
                    p={6}
                    borderRadius="lg"
                    mb={3}
                    maxW="90%"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Text fontWeight="semibold" mb={1}>
                      {msg.role === "user" ? "You" : "ZenFlow AI"}
                    </Text>
                    <Divider mb={2} borderColor={borderColor} />
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
                            <Box borderRadius="md" overflow="hidden" my={2}>
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
                              p={1}
                              borderRadius="md"
                              bg={codeColor}
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
                  <Spinner size="sm" />
                  <Text color="gray.500">generating...</Text>
                </HStack>
              )}
            </Flex>
            <Box p={4} borderTop="1px solid" borderColor={borderColor}>
              <HStack>
                <Input
                  placeholder="Type your question..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg={inputBg}
                  borderRadius="full"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleAskAI}
                  isLoading={isAiLoading}
                  borderRadius="full"
                  px={6}
                >
                  Ask
                </Button>
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}