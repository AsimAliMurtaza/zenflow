"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const ProjectSettingsPage = ({ projectID }: { projectID: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [isArchived, setIsArchived] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const labelColor = useColorModeValue("gray.700", "gray.300");

  const handleArchive = () => {
    setIsArchived(true);
    onClose();
  };

  const handleClose = () => {
    setIsClosed(true);
    onClose();
  };

  return (
    <Box p={6} mx="auto">
      <Heading size="2xl" mb={6} fontWeight="semibold">
        Project Settings
      </Heading>

      <VStack spacing={8} align="stretch">
        <Box p={6} borderRadius="xl" boxShadow="md" bg={cardBg}>
          <Heading size="md" mb={4} fontWeight="medium">
            Project Actions
          </Heading>
          <Divider mb={4} borderColor={dividerColor} />

          <VStack align="stretch" spacing={4}>
            <Button
              colorScheme={isArchived ? "gray" : "yellow"}
              variant="outline"
              onClick={onOpen}
              isDisabled={isArchived}
            >
              {isArchived ? "Project Archived" : "Archive Project"}
            </Button>
            <Button
              colorScheme={isClosed ? "gray" : "red"}
              variant="outline"
              onClick={onOpen}
              isDisabled={isClosed}
            >
              {isClosed ? "Project Closed" : "Close Project"}
            </Button>
          </VStack>
        </Box>

        {/* Project Information */}
        <Box p={6} borderRadius="xl" boxShadow="md" bg={cardBg}>
          <Heading size="md" mb={4} fontWeight="medium">
            Project Information
          </Heading>
          <Divider mb={4} borderColor={dividerColor} />

          <Text color={labelColor}>Project ID: {projectID}</Text>

          <Text color={labelColor}>
            Status: {isClosed ? "Closed" : isArchived ? "Archived" : "Active"}
          </Text>
          {/* Add more project information here */}
        </Box>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Action
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to{" "}
              {isArchived
                ? "unarchive"
                : isClosed
                ? "reopen"
                : "perform this action"}
              ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme={isArchived ? "yellow" : "red"}
                onClick={isArchived ? handleArchive : handleClose}
                ml={3}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProjectSettingsPage;
