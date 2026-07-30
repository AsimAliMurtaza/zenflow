import { prisma } from "@/lib/prisma";
import { getUserTeamIds } from "@/lib/authHelpers";

export async function buildUserWorkspaceContext(userId: string): Promise<string> {
  try {
    // 1. Fetch user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return "User not found in system.";
    }

    // 2. Fetch user's teams & members
    const teamIds = await getUserTeamIds(userId);
    const teams = await prisma.team.findMany({
      where: { id: { in: teamIds } },
      include: {
        members: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    // 3. Fetch user's accessible projects, sprints, and tasks
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdById: userId },
          { assignedTeamId: { in: teamIds } },
        ],
      },
      include: {
        assignedTeam: { select: { name: true } },
        sprints: {
          include: {
            tasks: {
              include: { assignees: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 4. Construct RAG Context Prompt
    const teamsSummary = teams.map((t) => ({
      teamName: t.name,
      members: t.members.map((m) => m.user?.name || m.user?.email || "Unknown"),
    }));

    const projectsSummary = projects.map((p) => {
      const allSprints = p.sprints || [];
      const allTasks = allSprints.flatMap((s) =>
        (s.tasks || []).map((t) => ({
          taskId: t.id,
          title: t.title,
          description: t.description || "None",
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "No due date",
          sprintName: s.name,
          assignees: (t.assignees || []).map((a) => a.userEmail),
        }))
      );

      return {
        projectId: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        completion: `${p.completion || 0}%`,
        dueDate: p.dueDate || "None",
        assignedTeam: p.assignedTeam?.name || "Unassigned",
        sprintCount: allSprints.length,
        tasksCount: allTasks.length,
        tasks: allTasks,
      };
    });

    const nowStr = new Date().toISOString().split("T")[0];

    const contextPayload = {
      systemTime: nowStr,
      currentUser: {
        id: user.id,
        name: user.name || "User",
        email: user.email,
        role: user.role,
      },
      userTeams: teamsSummary,
      accessibleProjectsCount: projectsSummary.length,
      projects: projectsSummary,
    };

    return JSON.stringify(contextPayload, null, 2);
  } catch (error) {
    console.error("Error building workspace RAG context:", error);
    return "Error building workspace context.";
  }
}
