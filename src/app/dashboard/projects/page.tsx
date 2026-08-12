import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Projects from "@/components/Projects";
import { getServerSession } from "next-auth";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  const projectsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.user?.id}`,
      },
    }
  );
  const projects = await projectsResponse.json();

  const teamsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teams`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.user?.id}`,
      },
    }
  );
  const teams = await teamsResponse.json();

  if (!projects || !teams) {
    return <div>Failed to load data</div>;
  }

  return (
    <Projects
      projects={Array.isArray(projects) ? projects : []}
      teams={Array.isArray(teams) ? teams : []}
    />
  );
}
