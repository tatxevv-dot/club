import { LeagueGrid } from "@/components/league-grid";

export default function LeaguesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Лиги и турниры</h1>
      <LeagueGrid />
    </div>
  );
}
