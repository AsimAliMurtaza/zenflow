import Teams from "@/components/Teams";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Member from "@/models/Member"; // Ensure this import is correct
import mongoose from "mongoose";

export default async function TeamsPage() {
  await connectDB();

  // Ensure the Member model is registered
  if (!mongoose.models.Member) {
    mongoose.model("Member", Member.schema);
  }

  const teams = await Team.find().populate("members");

  return <Teams teams={JSON.parse(JSON.stringify(teams))} />;
}
