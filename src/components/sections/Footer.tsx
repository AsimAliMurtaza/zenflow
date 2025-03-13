"use client";

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  Divider,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg={useColorModeValue("gray.100", "gray.800")}
      color={useColorModeValue("gray.700", "gray.300")}
      py={12}
      mt={6}
    >
      <Container maxW="container.xl">
        {/* Footer Content */}
        <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={10}>
          {/* Column 1 */}
          <Stack align="flex-start">
            <Text fontWeight="bold">Company</Text>
            <Link href="#">Careers</Link>
            <Link href="#">Events</Link>
            <Link href="#">Blogs</Link>
            <Link href="#">Investor Relations</Link>
            <Link href="#">Contact Us</Link>
          </Stack>

          {/* Column 2 */}
          <Stack align="flex-start">
            <Text fontWeight="bold">Products</Text>
            <Link href="#">Zenflow</Link>
            <Link fontWeight="bold" href="#">
              See all products →
            </Link>
          </Stack>

          {/* Column 3 */}
          <Stack align="flex-start">
            <Text fontWeight="bold">Resources</Text>
            <Link href="#">Technical Support</Link>
            <Link href="#">Purchasing & Licensing</Link>
            <Link href="#">Zenflow Community</Link>
            <Link href="#">Marketplace</Link>
            <Link href="#">My Account</Link>
            <Link fontWeight="bold" href="#">
              Create support ticket →
            </Link>
          </Stack>

          {/* Column 4 */}
          <Stack align="flex-start">
            <Text fontWeight="bold">Learn</Text>
            <Link href="#">Partners</Link>
            <Link href="#">Training & Certification</Link>
            <Link href="#">Documentation</Link>
            <Link href="#">Developer Resources</Link>
            <Link href="#">Enterprise Services</Link>
            <Link fontWeight="bold" href="#">
              See all resources →
            </Link>
          </Stack>
        </SimpleGrid>

        {/* Divider */}
        <Divider my={6} />

        {/* Bottom Section */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          mb={-10}
        >
          <Text>Copyright © {new Date().getFullYear()} Zenflow Inc.</Text>
          <Stack direction="row" spacing={6}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Impressum</Link>
          </Stack>
          <IconButton
            aria-label="Change language"
            icon={<FaGlobe />}
            variant="ghost"
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
