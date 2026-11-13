import { MatchCenter } from "@/components/match-center";

export default function MatchPage({ params }: { params: { id: string } }) {
  return <MatchCenter id={params.id} />;
}
