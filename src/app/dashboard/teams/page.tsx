import Teams from "@/components/Teams";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.id}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return <div>Failed to load teams</div>;
  }

  const teams = await response.json();

  return <Teams teams={Array.isArray(teams) ? teams : []} />;
}