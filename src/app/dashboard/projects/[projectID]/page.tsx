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
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const MotionBox = motion(Box);

// Dynamically import the Board component to avoid SSR issues
const BoardPage = dynamic(() => import("./board/page"), { ssr: false });

const ProjectTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const params = useParams();
  const projectID = params?.projectID;

  return (
    <Container maxW="100vw">
      {/* Tab Bar */}
      <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
        <TabList >
          {["Overview", "Board", "Settings"].map((tab, index) => (
            <MotionBox key={index} whileTap={{ scale: 0.95 }}>
              <Tab
                
                fontSize="lg"
                fontWeight="semibold"
                px={6}
              >
                {tab}
              </Tab>
            </MotionBox>
          ))}
        </TabList>
        <Divider />
        {/* Tab Content */}
        <TabPanels mt={4}>
          <TabPanel>
            <Heading size="md">📌 Overview</Heading>
            <p>Project details and summary go here...</p>
          </TabPanel>

          {/* Render Board component when "Board" tab is selected */}
          <TabPanel>
            <BoardPage projectID={projectID} />
          </TabPanel>

          <TabPanel>
            <Heading size="md">⚙️ Settings</Heading>
            <p>Project settings and configurations...</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProjectTabs;
