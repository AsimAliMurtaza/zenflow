import { notFound } from "next/navigation";
import ProjectOverview from "@/components/ProjectOverview";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export default async function ProjectOverviewPage({
  params,
}: {
  params: { projectID: string };
}) {
  await connectDB();
  const project = await Project.findById(params.projectID)
    .populate("assignedTeam")
    .populate("tasks.assignedTo")
    .populate("sprints.tasks");

  if (!project) {
    notFound();
  }

  return <ProjectOverview project={JSON.parse(JSON.stringify(project))} />;
}
