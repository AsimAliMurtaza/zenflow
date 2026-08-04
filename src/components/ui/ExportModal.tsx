"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiDownload, FiFileText, FiCode } from "react-icons/fi";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export const ExportModal = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}: ExportModalProps) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("gray.50", "gray.750");

  const handleExport = (format: "csv" | "json") => {
    const url = `/api/projects/${projectId}/export?format=${format}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}_export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="2xl" shadow="2xl" overflow="hidden">
        <ModalHeader borderBottom="1px solid" borderColor={borderColor} p={5}>
          <HStack spacing={3}>
            <Icon as={FiDownload} boxSize={5} color="blue.500" />
            <Text fontSize="md" fontWeight="bold">
              Export Project Data
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        <ModalBody p={6}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="xs" color="gray.500">
              Download complete project issues, sprint breakdowns, priority details, and team assignments for <strong>{projectName}</strong>.
            </Text>

            {/* CSV Option */}
            <HStack
              p={4}
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              justify="space-between"
              cursor="pointer"
              _hover={{ borderColor: "blue.500", transform: "translateY(-1px)" }}
              transition="all 0.2s ease"
              onClick={() => handleExport("csv")}
            >
              <HStack spacing={3}>
                <Icon as={FiFileText} boxSize={6} color="green.500" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="sm">
                    CSV Spreadsheet (.csv)
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Ideal for Excel, Google Sheets, or data reporting
                  </Text>
                </VStack>
              </HStack>
              <Button size="xs" colorScheme="green" borderRadius="lg">
                Export
              </Button>
            </HStack>

            {/* JSON Option */}
            <HStack
              p={4}
              bg={cardBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              justify="space-between"
              cursor="pointer"
              _hover={{ borderColor: "blue.500", transform: "translateY(-1px)" }}
              transition="all 0.2s ease"
              onClick={() => handleExport("json")}
            >
              <HStack spacing={3}>
                <Icon as={FiCode} boxSize={6} color="blue.500" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="sm">
                    JSON Structured Data (.json)
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Full raw data dump for API integrations or backups
                  </Text>
                </VStack>
              </HStack>
              <Button size="xs" colorScheme="blue" borderRadius="lg">
                Export
              </Button>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter bg={cardBg} p={4} borderTop="1px solid" borderColor={borderColor}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
