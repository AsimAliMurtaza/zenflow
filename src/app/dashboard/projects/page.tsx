import Projects from "@/components/Projects";

export default async function ProjectsPage() {
  const projectsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
    {
      cache: "no-store",
    }
  );
  const projects = await projectsResponse.json();

  const teamsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teams`,
    {
      cache: "no-store",
    }
  );
  const teams = await teamsResponse.json();

  return <Projects projects={projects} teams={teams} />;
}
