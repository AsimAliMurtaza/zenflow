import Teams from "@/components/Teams";

export default async function TeamsPage() {
  // Fetch teams from the API
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Ensure fresh data is fetched
  });

  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }

  const teams = await response.json();
  console.log(teams); // Debugging: Check the fetched data

  return <Teams teams={teams} />;
}