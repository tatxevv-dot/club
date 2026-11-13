"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlayerSkeleton } from "./skeletons";
import { fmt } from "@/lib/format";

export function PlayerProfile({ id }: { id: string }) {
  const [player, setPlayer] = useState<any>(null);
  const [season, setSeason] = useState<any>(null);
  useEffect(() => {
    supabase.from("players").select("*").eq("id", id).single().then(({ data }) => setPlayer(data));
    supabase.from("player_season_stats").select("*").eq("player_id", id).limit(1).then(({ data }) => setSeason(data?.[0] ?? null));
  }, [id]);
  if (!player) return <PlayerSkeleton />;
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="card p-6">
        <div className="mx-auto h-32 w-32 rounded-full bg-white/5" />
        <h1 className="mt-6 text-2xl font-bold text-white">{player.full_name}</h1>
        <p className="text-slate-400">{player.position ?? "—"}</p>
      </div>
      <div className="space-y-4">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Сезон</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Матчи" value={season?.appearances} />
            <Stat label="Голы" value={season?.goals} />
            <Stat label="Ассисты" value={season?.assists} />
            <Stat label="xG" value={fmt(season?.xg)} />
          </div>
        </div>
        <div className="card p-6"><div className="skeleton h-64" /></div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return <div><div className="label">{label}</div><div className="stat">{value ?? "—"}</div></div>;
}
