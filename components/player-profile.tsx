"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlayerRadar } from "@/components/player-radar";

export function PlayerProfile({ id }: { id: string }) {
  const [player, setPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    supabase.from("players").select("*,team:teams(name)").eq("id", id).single().then(({ data }) => setPlayer(data));
    supabase.from("player_season_stats").select("*").eq("player_id", id).maybeSingle().then(({ data }) => setStats(data));
  }, [id]);

  if (!player) return <div className="skeleton h-40" />;

  return (
    <div className="container-page space-y-6">
      <div className="card p-8"><h1 className="text-3xl font-semibold tracking-tight">{player.name}</h1><p className="text-[#86868b]">{player.team?.name} · {player.position} · {player.league}</p></div>
      {stats && <div className="card p-6"><h2 className="mb-4 text-lg font-semibold">Radar-профиль сезона</h2><PlayerRadar a={stats} b={stats} nameA={player.name} nameB={player.name} /></div>}
    </div>
  );
}
