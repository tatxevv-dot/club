"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [league, setLeague] = useState("");
  const [position, setPosition] = useState("");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    supabase.from("players").select("id,name,team:teams(name),position,league").then(({ data }) => setPlayers(data ?? []));
  }, []);

  const filtered = useMemo(() => {
    return players.filter((p) => (!league || p.league === league) && (!position || p.position === position)).slice(0, 100);
  }, [players, league, position]);

  const leagues = [...new Set(players.map((p) => p.league).filter(Boolean))];
  const positions = ["GK","DF","MF","FW"];

  return (
    <div className="container-page space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Игроки</h1>
      <div className="flex flex-wrap gap-3">
        <select value={league} onChange={(e) => setLeague(e.target.value)} className="input max-w-xs"><option value="">Все лиги</option>{leagues.map((l) => <option key={l}>{l}</option>)}</select>
        <select value={position} onChange={(e) => setPosition(e.target.value)} className="input max-w-xs"><option value="">Все позиции</option>{positions.map((p) => <option key={p}>{p}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input max-w-xs"><option value="rating">По рейтингу</option><option value="goals">По голам</option><option value="xg">По xG</option><option value="assists">По ассистам</option></select>
      </div>
      <div className="card divide-y divide-black/5">
        {filtered.map((p) => (
          <Link key={p.id} href={`/players/${p.id}`} className="flex items-center justify-between p-4 hover:bg-black/[0.03]">
            <div><div className="font-medium">{p.name}</div><div className="text-sm text-[#86868b]">{p.team?.name} · {p.position}</div></div>
            <div className="text-sm text-[#86868b]">{p.league}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
