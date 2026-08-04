"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Spinner,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { GrRobot } from "react-icons/gr";
import { FiActivity, FiRefreshCw } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

interface AIHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

interface ProjectMetrics {
  completionPercentage: number;
  completedTasks: number;
  totalTasks: number;
  overdueCount: number;
}

export const AIHealthCheckModal = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}: AIHealthCheckModalProps) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("gray.50", "gray.750");

  const runHealthCheck = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gemini/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data.healthReport);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      runHealthCheck();
    }
  }, [isOpen, projectId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg={bg} borderRadius="2xl" shadow="2xl" overflow="hidden">
        <ModalHeader borderBottom="1px solid" borderColor={borderColor} p={5}>
          <HStack spacing={3}>
            <Flex
              w={9}
              h={9}
              bg="purple.500"
              color="white"
              borderRadius="xl"
              align="center"
              justify="center"
            >
              <GrRobot size={20} />
            </Flex>
            <Box>
              <Text fontSize="md" fontWeight="bold">
                AI Sprint Risk & Project Health Analysis
              </Text>
              <Text fontSize="xs" color="gray.500">
                Powered by Gemini AI for {projectName}
              </Text>
            </Box>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        <ModalBody p={6}>
          {loading ? (
            <VStack py={10} spacing={4}>
              <Spinner size="xl" color="purple.500" thickness="3px" />
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                Analyzing sprint velocity, overdue tasks, and workload risk...
              </Text>
            </VStack>
          ) : report ? (
            <VStack align="stretch" spacing={5}>
              {/* Quick Metrics Bar */}
              {metrics && (
                <HStack spacing={3} wrap="wrap">
                  <Badge colorScheme="blue" p={2} borderRadius="lg">
                    Completion: {metrics.completionPercentage}%
                  </Badge>
                  <Badge colorScheme="purple" p={2} borderRadius="lg">
                    Tasks: {metrics.completedTasks}/{metrics.totalTasks} Done
                  </Badge>
                  {metrics.overdueCount > 0 && (
                    <Badge colorScheme="red" p={2} borderRadius="lg">
                      ⚠️ {metrics.overdueCount} Overdue
                    </Badge>
                  )}
                </HStack>
              )}

              {/* Gemini Report Markdown output */}
              <Box
                bg={cardBg}
                p={5}
                borderRadius="xl"
                fontSize="sm"
                className="markdown-content"
                sx={{
                  "& h3": { fontSize: "md", fontWeight: "bold", mb: 2, color: "purple.400" },
                  "& h4": { fontSize: "sm", fontWeight: "bold", mt: 3, mb: 1 },
                  "& ul": { pl: 4, mb: 2 },
                  "& li": { mb: 1 },
                  "& p": { mb: 2 },
                }}
              >
                <ReactMarkdown>{report}</ReactMarkdown>
              </Box>
            </VStack>
          ) : (
            <VStack py={8} spacing={4} textAlign="center">
              <Icon as={FiActivity} boxSize={8} color="purple.400" />
              <Text fontSize="sm" color="gray.500">
                Click below to generate a real-time Gemini AI risk assessment for this project.
              </Text>
              <Button
                colorScheme="purple"
                borderRadius="full"
                leftIcon={<FiActivity />}
                onClick={runHealthCheck}
              >
                Run Health Check
              </Button>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter bg={cardBg} p={4} borderTop="1px solid" borderColor={borderColor}>
          <HStack justify="space-between" w="full">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FiRefreshCw />}
              isLoading={loading}
              onClick={runHealthCheck}
            >
              Re-analyze
            </Button>
            <Button colorScheme="blue" borderRadius="full" size="sm" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
