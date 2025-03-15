"use client";

import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

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
  const params = useParams();
  const projectID = params?.projectID as string; // Ensure projectID is a string
  const router = useRouter();

  // Tab labels
  const tabs = ["Overview", "Board", "Settings"];

  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Container maxW="100vw" p={0}>
      {/* Tab Bar */}
      <Tabs index={activeTab} onChange={handleTabChange} variant="enclosed">
        <TabList>
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
        <TabPanels mt={4}>
          {/* Overview Tab */}
          <TabPanel>
            <OverviewPage />
          </TabPanel>

          {/* Board Tab */}
          <TabPanel>
            <BoardPage />
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <SettingsPage projectID={projectID} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProjectTabs;
