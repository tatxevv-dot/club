"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TableSkeleton } from "./skeletons";

export function PlayerSearch() {
  const [q, setQ] = useState("");
  const [players, setPlayers] = useState<any[] | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      supabase.from("players").select("id,full_name,position,photo_url").ilike("full_name", `%${q}%`).limit(30)
        .then(({ data }) => setPlayers(data ?? []));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  if (!players) return <TableSkeleton rows={6} />;
  return (
    <div className="space-y-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск игрока..." className="w-full rounded-xl border border-line bg-card px-4 py-3 text-white outline-none focus:border-accent" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((p) => (
          <Link key={p.id} href={`/player/${p.id}`} className="card p-4 hover:border-accent/50">
            <div className="font-semibold text-white">{p.full_name}</div>
            <div className="text-sm text-slate-400">{p.position ?? "—"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
