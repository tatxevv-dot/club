"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TableSkeleton } from "./skeletons";

export function TeamProfile({ id }: { id: string }) {
  const [team, setTeam] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    supabase.from("teams").select("*").eq("id", id).single().then(({ data }) => setTeam(data));
    supabase.from("team_season_stats").select("*").eq("team_id", id).limit(1).then(({ data }) => setStats(data?.[0] ?? null));
  }, [id]);
  if (!team) return <TableSkeleton rows={5} />;
  return (
    <div className="space-y-6">
      <div className="card p-6"><h1 className="text-3xl font-bold text-white">{team.name}</h1><p className="text-slate-400">{team.country}</p></div>
      <div className="card p-6"><h2 className="text-lg font-semibold text-white">Статистика сезона</h2><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Матчи" value={stats?.matches} /><Stat label="Победы" value={stats?.wins} /><Stat label="xG" value={stats?.xg_for} /><Stat label="xGA" value={stats?.xg_against} />
      </div></div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: any }) {
  return <div><div className="label">{label}</div><div className="stat">{value ?? "—"}</div></div>;
}
