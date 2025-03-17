"use client";

import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Spinner,
  Center,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Project } from "@/types/types";

const MotionBox = motion(Box);

// Dynamically import components to avoid SSR issues
const BoardPage = dynamic(() => import("@/components/KanbanBoard"), {
  ssr: false,
});
const OverviewPage = dynamic(() => import("@/components/ProjectOverview"), {
  ssr: false,
});
const SettingsPage = dynamic(() => import("@/components/ProjectSettings"), {
  ssr: false,
});

const ProjectTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { projectID } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabColor = useColorModeValue("white", "gray.800");

  console.log("Project ID:", projectID);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectID}`);
        if (!response.ok) throw new Error("Failed to fetch project");

        const data = await response.json();
        setProject(data);
        console.log("Project data:", data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };

    if (projectID) fetchProject();
  }, [projectID]);

  // Handle loading state
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Handle error state
  if (error || !project) {
    return (
      <Center h="100vh">
        <Text fontSize="lg" color="red.500">
          {error || "Project not found"}
        </Text>
      </Center>
    );
  }

  // Tab labels
  const tabs = ["Overview", "Board", "Settings"];

  return (
    <Container maxW="100vw" p={0}>
      {/* Tab Bar */}
      <Tabs  index={activeTab} onChange={setActiveTab} variant="line">
        <TabList position="fixed" bg={tabColor} w="100%" zIndex="1000">
          {tabs.map((tab, index) => (
            <MotionBox key={index} whileTap={{ scale: 0.95 }}>
              <Tab fontSize="lg" fontWeight="semibold" px={6}>
                {tab}
              </Tab>
            </MotionBox>
          ))}
        </TabList>
        <Divider />
        {/* Tab Content */}
        <TabPanels mt={8}>
          <TabPanel>
            <OverviewPage project={project} />
          </TabPanel>
          <TabPanel>
            <BoardPage />
          </TabPanel>
          <TabPanel>
            <SettingsPage
              projectID={
                Array.isArray(projectID) ? projectID[0] : projectID || ""
              }
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProjectTabs;
