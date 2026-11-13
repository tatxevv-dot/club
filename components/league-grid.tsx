"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TableSkeleton } from "./skeletons";

export function LeagueGrid() {
  const [leagues, setLeagues] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("leagues").select("*").order("name").then(({ data }) => setLeagues(data ?? []));
  }, []);
  if (!leagues) return <TableSkeleton rows={4} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {leagues.map((l) => (
        <Link key={l.id} href={`/league/${l.id}`} className="card p-5 transition hover:-translate-y-1 hover:border-accent/50">
          <div className="text-lg font-semibold text-white">{l.name}</div>
          <div className="mt-1 text-sm text-slate-400">{l.country ?? "Международный турнир"}</div>
        </Link>
      ))}
    </div>
  );
}
