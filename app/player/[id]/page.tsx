import { PlayerProfile } from "@/components/player-profile";

export default function PlayerPage({ params }: { params: { id: string } }) {
  return <PlayerProfile id={params.id} />;
}
