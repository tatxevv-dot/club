import { TeamProfile } from "@/components/team-profile";

export default function TeamPage({ params }: { params: { id: string } }) {
  return <TeamProfile id={params.id} />;
}
