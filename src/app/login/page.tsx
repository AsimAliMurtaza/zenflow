"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  FormControl,
  FormLabel,
  useToast,
  Container,
  Flex,
  Image,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaApple, FaSlack } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userExists, setUserExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  // Simulate checking if user exists (Replace with real API call)
  const checkUserExists = async (email: string) => {
    setLoading(true);

    // Simulated API delay
    setTimeout(() => {
      if (email === "user@example.com") {
        setUserExists(true); // Simulate found user
      } else {
        setUserExists(false);
        toast({
          title: "User not found",
          description: "No account exists with this email.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    }, 1500);
  };


  const handleLogin = async () => {
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (res?.error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (res?.ok) {
      router.push("/dashboard");
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bg={bgColor}
      bgImage="/bg-pattern.svg"
      bgSize="cover"
      bgPosition="center"
    >
      <Container maxW="sm" px={4}>
        <Box
          bg={cardBgColor}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          textAlign="center"
        >
          {/* 🏢 Logo */}
          <Image src="/logo.svg" alt="Zenflow" mx="auto" h="40px" mb={4} />

          {/* 📝 Heading */}
          <Heading size="md" fontWeight="bold" color={textColor}>
            Log in to continue
          </Heading>

          <VStack spacing={4} align="stretch" mt={6}>
            {/* 📨 Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel fontSize="sm" color={textColor}>
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                bg={cardBgColor}
                border="1px solid"
                borderColor={borderColor}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel fontSize="sm" color={textColor}>
                Password
              </FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                bg={cardBgColor}
                border="1px solid"
                borderColor={borderColor}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
            </FormControl>

            <Button
              onClick={handleLogin}
              colorScheme="blue"
              w="full"
              size="md"
              isLoading={loading}
            >
              Continue
            </Button>

            <Divider borderColor={borderColor} />

            <Text fontSize="sm" color={textColor}>
              Or continue with
            </Text>
            <VStack spacing={3} w="full">
              <Button
                variant="outline"
                w="full"
                leftIcon={<FcGoogle />}
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Google
              </Button>
              <Button
                variant="outline"
                w="full"
                leftIcon={<FaMicrosoft color="#0066B8" />}
                onClick={() =>
                  signIn("microsoft", { callbackUrl: "/dashboard" })
                }
              >
                Microsoft
              </Button>
              <Button
                variant="outline"
                w="full"
                leftIcon={<FaSlack color="#4A154B" />}
                onClick={() => signIn("slack", { callbackUrl: "/dashboard" })}
              >
                Slack
              </Button>
            </VStack>

            {/* 🔗 Extra Links */}
            <Text fontSize="sm" color="blue.500" textAlign="center" mt={4}>
              <Button
                variant="link"
                onClick={() => router.push("/forgot-password")}
              >
                Can't log in?
              </Button>{" "}
              •{" "}
              <Button variant="link" onClick={() => router.push("/signup")}>
                Create an account
              </Button>
            </Text>
          </VStack>

          {/* 📜 Footer */}
          <Text fontSize="xs" color={textColor} mt={6}>
            One account for Zenflow.{" "}
            <Button variant="link" color="blue.500">
              Learn more
            </Button>
          </Text>
        </Box>
      </Container>
    </Flex>
  );
}