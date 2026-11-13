import { MatchList } from "@/components/match-list";

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Матчи</h1>
      <MatchList />
    </div>
  );
}
