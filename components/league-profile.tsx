"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TableSkeleton } from "./skeletons";

export function LeagueProfile({ id }: { id: string }) {
  const [league, setLeague] = useState<any>(null);
  const [matches, setMatches] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("leagues").select("*").eq("id", id).single().then(({ data }) => setLeague(data));
    supabase.from("matches").select("*, home:teams!matches_home_team_id_fkey(name), away:teams!matches_away_team_id_fkey(name)").eq("league_id", id).order("kickoff_at", { ascending: false }).limit(20).then(({ data }) => setMatches(data ?? []));
  }, [id]);
  if (!league) return <TableSkeleton rows={6} />;
  return (
    <div className="space-y-6">
      <div className="card p-6"><h1 className="text-3xl font-bold text-white">{league.name}</h1></div>
      <div className="card p-6"><h2 className="text-lg font-semibold text-white">Последние матчи</h2>
        <div className="mt-4 space-y-2">{matches?.map((m) => <div key={m.id} className="rounded-lg bg-white/5 p-3">{m.home?.name} {m.home_score ?? "—"} : {m.away_score ?? "—"} {m.away?.name}</div>)}</div>
      </div>
    </div>
  );
}
