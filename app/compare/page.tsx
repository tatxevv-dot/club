"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlayerRadar } from "@/components/player-radar";

export default function ComparePage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    supabase.from("players").select("id,name,team:teams(name),position,league").order("name").then(({ data }) => setPlayers(data ?? []));
  }, []);

  useEffect(() => {
    if (!a || !b) return;
    Promise.all([
      supabase.from("player_season_stats").select("*").eq("player_id", a).maybeSingle(),
      supabase.from("player_season_stats").select("*").eq("player_id", b).maybeSingle(),
    ]).then(([x, y]) => setData({ a: x.data, b: y.data }));
  }, [a, b]);

  const pa = players.find((p) => p.id === a);
  const pb = players.find((p) => p.id === b);

  return (
    <div className="container-page space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Сравнение игроков</h1>
      <div className="card p-4 grid gap-4 md:grid-cols-2">
        <select value={a} onChange={(e) => setA(e.target.value)} className="input"><option value="">Игрок A</option>{players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <select value={b} onChange={(e) => setB(e.target.value)} className="input"><option value="">Игрок B</option>{players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      </div>
      {data?.a && data?.b && (
        <div className="card p-6">
          <div className="mb-6 text-center text-lg font-semibold">{pa?.name} vs {pb?.name}</div>
          <PlayerRadar a={data.a} b={data.b} nameA={pa?.name ?? "A"} nameB={pb?.name ?? "B"} />
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {["goals","assists","xg","xa","shots","key_passes","progressive_passes","tackles","interceptions","rating"].map((k) => (
              <div key={k} className="flex justify-between border-b border-black/5 pb-2"><span className="text-[#86868b]">{k}</span><span className="font-medium">{Number(data.a[k] ?? 0).toFixed(2)} / {Number(data.b[k] ?? 0).toFixed(2)}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
