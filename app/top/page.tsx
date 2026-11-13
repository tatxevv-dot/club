"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TopPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [metric, setMetric] = useState("rating");

  useEffect(() => {
    supabase.from("player_season_stats").select("player_id,goals,xg,rating,player:players(id,name,team:teams(name),position)").order(metric, { ascending: false }).limit(20).then(({ data }) => setPlayers(data ?? []));
  }, [metric]);

  return (
    <div className="container-page space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Топ-игроки недели</h1>
      <div className="flex gap-3">
        <select value={metric} onChange={(e) => setMetric(e.target.value)} className="input max-w-xs">
          <option value="rating">По рейтингу</option><option value="goals">По голам</option><option value="xg">По xG</option>
        </select>
      </div>
      <div className="card divide-y divide-black/5">
        {players.map((p, i) => (
          <Link key={p.player_id} href={`/players/${p.player_id}`} className="flex items-center justify-between p-4 hover:bg-black/[0.03]">
            <div className="flex items-center gap-4"><span className="w-6 text-[#86868b]">{i + 1}</span><div><div className="font-medium">{p.player?.name}</div><div className="text-sm text-[#86868b]">{p.player?.team?.name}</div></div></div>
            <div className="font-semibold">{Number(p[metric] ?? 0).toFixed(2)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
