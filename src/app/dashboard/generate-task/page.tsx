// app/dashboard/generate-tasks/page.tsx

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import GenerateTasks from "@/components/GenerateTasks";
import { Project } from "@/types/types";
import { getServerSession } from "next-auth";
import { Box, Text } from "@chakra-ui/react";

const GenerateTasksPage = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${session?.user.id}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch projects:", res.status);
    return (
      <Box py={10} px={6} textAlign="center">
        <Text fontSize="lg" color="red.500">
          Failed to load projects.
        </Text>
      </Box>
    );
  }

  const projects: Project[] = await res.json();

  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }} minH="100vh">
      <GenerateTasks projects={projects} />
    </Box>
  );
};

export default GenerateTasksPage;
