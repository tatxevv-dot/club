import { PlayerSearch } from "@/components/player-search";

export default function PlayersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Игроки</h1>
      <PlayerSearch />
    </div>
  );
}
