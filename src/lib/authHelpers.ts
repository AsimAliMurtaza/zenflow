import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUserId(req?: Request): Promise<string | null> {
  // 1. Try NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch (err) {
    // ignore
  }

  // 2. Try Bearer header
  if (req) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token && token.trim() !== "" && token !== "undefined") {
        return token.trim();
      }
    }
  }

  return null;
}

export async function getUserTeamIds(userId: string): Promise<string[]> {
  const memberships = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  return memberships.map((m) => m.teamId);
}

export async function isUserAuthorizedForProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { createdById: true, assignedTeamId: true },
  });

  if (!project) return false;

  // Creator has full access
  if (project.createdById === userId) return true;

  // Check if assigned team includes user
  if (project.assignedTeamId) {
    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: project.assignedTeamId,
          userId,
        },
      },
    });
    if (member) return true;
  }

  return false;
}
