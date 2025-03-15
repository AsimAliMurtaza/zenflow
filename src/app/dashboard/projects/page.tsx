import Projects from "@/components/Projects";
import mongoose from "mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";

export default async function ProjectsPage() {
  if (mongoose.models.Project) {
    mongoose.model("Project", Project.schema);
  }
  if (mongoose.models.Team) {
    mongoose.model("Team", Team.schema);
  }
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
