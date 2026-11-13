"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TableSkeleton } from "./skeletons";

export function TeamSearch() {
  const [q, setQ] = useState("");
  const [teams, setTeams] = useState<any[] | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      supabase.from("teams").select("id,name,country,logo_url").ilike("name", `%${q}%`).limit(30)
        .then(({ data }) => setTeams(data ?? []));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  if (!teams) return <TableSkeleton rows={6} />;
  return (
    <div className="space-y-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск команды..." className="w-full rounded-xl border border-line bg-card px-4 py-3 text-white outline-none focus:border-accent" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <Link key={t.id} href={`/team/${t.id}`} className="card p-4 hover:border-accent/50">
            <div className="font-semibold text-white">{t.name}</div>
            <div className="text-sm text-slate-400">{t.country ?? "—"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
