"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any>({ matches: [], players: [], teams: [] });

  const search = async () => {
    if (!q) return;
    const [m, p, t] = await Promise.all([
      supabase.from("matches").select("id,home:teams!matches_home_team_id_fkey(name),away:teams!matches_away_team_id_fkey(name)").ilike("home.name", `%${q}%`).limit(10),
      supabase.from("players").select("id,name,team:teams(name)").ilike("name", `%${q}%`).limit(10),
      supabase.from("teams").select("id,name").ilike("name", `%${q}%`).limit(10),
    ]);
    setResults({ matches: m.data ?? [], players: p.data ?? [], teams: t.data ?? [] });
  };

  return (
    <div className="container-page space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Поиск</h1>
      <div className="flex gap-3"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Матч, игрок или команда" className="input flex-1" /><button onClick={search} className="btn-primary">Найти</button></div>
      <div className="card divide-y divide-black/5">
        {results.matches.map((m) => <Link key={m.id} href={`/matches/${m.id}`} className="block p-4 hover:bg-black/[0.03]">{m.home?.name} vs {m.away?.name}</Link>)}
        {results.players.map((p) => <Link key={p.id} href={`/players/${p.id}`} className="block p-4 hover:bg-black/[0.03]">{p.name} · {p.team?.name}</Link>)}
        {results.teams.map((t) => <Link key={t.id} href={`/teams/${t.id}`} className="block p-4 hover:bg-black/[0.03]">{t.name}</Link>)}
      </div>
    </div>
  );
}
