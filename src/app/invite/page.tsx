"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Button,
  Text,
  Flex,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";

const AcceptInviteComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) router.push("/");
  }, [router, token]);

  const acceptInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      if (res.ok) {
        toast({
          title: "Invitation Accepted!",
          description: "You have successfully joined the team.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        toast({
          title: "Error Accepting Invite",
          description: errorData.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error accepting invite:", error);

      toast({
        title: "Error Accepting Invite",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Card maxW="md" w="full" borderRadius="2xl" boxShadow="lg" bg="white">
        <CardBody textAlign="center" p={8}>
          <Heading size="lg" mb={4} color="gray.700">
            🎉 Team Invitation
          </Heading>
          <Text fontSize="md" color="gray.600" mb={6}>
            You have been invited to join a team! Click the button below to
            accept the invitation.
          </Text>
        </CardBody>
        <CardFooter justify="center" p={6}>
          <Button
            onClick={acceptInvite}
            isLoading={loading}
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            px={8}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
            transition="all 0.2s"
          >
            {loading ? <Spinner size="sm" /> : "Accept Invitation"}
          </Button>
        </CardFooter>
      </Card>
    </Flex>
  );
};

const AcceptInvite = dynamic(() => Promise.resolve(AcceptInviteComponent), {
  ssr: false,
});

export default AcceptInvite;