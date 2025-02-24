import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" maxW="100vw" bg="gray.100">
        <Topbar />
        <Box>{children}</Box>
      </Box>
    </Flex>
  );
}
