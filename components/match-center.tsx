"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TableSkeleton } from "./skeletons";

export function MatchCenter({ id }: { id: string }) {
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("matches").select("*, home:teams!matches_home_team_id_fkey(name), away:teams!matches_away_team_id_fkey(name)").eq("id", id).single().then(({ data }) => setMatch(data));
    supabase.from("match_events").select("*").eq("match_id", id).order("minute").then(({ data }) => setEvents(data ?? []));
  }, [id]);
  if (!match) return <TableSkeleton rows={6} />;
  return (
    <div className="space-y-6">
      <div className="card p-6 text-center">
        <div className="text-xl font-bold text-white">{match.home?.name} {match.home_score ?? "—"} : {match.away_score ?? "—"} {match.away?.name}</div>
      </div>
      <div className="card p-6"><h2 className="text-lg font-semibold text-white">События</h2>
        <div className="mt-4 space-y-2">{events?.map((e) => <div key={e.id} className="rounded-lg bg-white/5 p-3 text-sm">{e.minute}' · {e.event_type}</div>)}</div>
      </div>
    </div>
  );
}
