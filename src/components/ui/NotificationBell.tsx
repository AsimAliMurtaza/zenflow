"use client";

import { useEffect, useState } from "react";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useColorModeValue,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { FiBell, FiCheck, FiInfo } from "react-icons/fi";
import { Notification } from "@/types/types";
import { useRouter } from "next/navigation";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const itemHoverBg = useColorModeValue("gray.50", "gray.750");
  const unreadBg = useColorModeValue("blue.50", "blue.900");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleItemClick = async (notif: Notification) => {
    if (!notif.read) {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: notif.id }),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box position="relative" display="inline-block">
          <IconButton
            aria-label="Notifications"
            icon={<FiBell size={18} />}
            variant="ghost"
            size="sm"
            borderRadius="full"
          />
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="-2px"
              right="-2px"
              fontSize="10px"
              px={1.5}
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent bg={bg} borderColor={borderColor} shadow="2xl" borderRadius="2xl" w="340px">
        <PopoverHeader borderBottomWidth="1px" borderColor={borderColor} p={3.5}>
          <HStack justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="sm">
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="blue"
                leftIcon={<FiCheck />}
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
          </HStack>
        </PopoverHeader>
        <PopoverBody p={2} maxH="320px" overflowY="auto">
          {loading && notifications.length === 0 ? (
            <Box py={6} textAlign="center">
              <Spinner size="sm" color="blue.500" />
            </Box>
          ) : notifications.length === 0 ? (
            <Box py={8} textAlign="center" color="gray.500">
              <Icon as={FiInfo} boxSize={5} mb={1} />
              <Text fontSize="xs">No notifications yet</Text>
            </Box>
          ) : (
            <VStack align="stretch" spacing={1}>
              {notifications.map((notif) => (
                <Box
                  key={notif.id}
                  p={3}
                  borderRadius="xl"
                  bg={notif.read ? "transparent" : unreadBg}
                  _hover={{ bg: itemHoverBg }}
                  cursor="pointer"
                  onClick={() => handleItemClick(notif)}
                  transition="all 0.15s ease"
                >
                  <HStack justify="space-between" align="start" mb={0.5}>
                    <Text
                      fontSize="xs"
                      fontWeight={notif.read ? "semibold" : "bold"}
                      color={notif.read ? "inherit" : "blue.500"}
                    >
                      {notif.title}
                    </Text>
                    <Text fontSize="10px" color="gray.400">
                      {new Date(notif.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.600" noOfLines={2}>
                    {notif.message}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
