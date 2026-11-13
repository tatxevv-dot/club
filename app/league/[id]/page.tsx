import { LeagueProfile } from "@/components/league-profile";

export default function LeaguePage({ params }: { params: { id: string } }) {
  return <LeagueProfile id={params.id} />;
}
