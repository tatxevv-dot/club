"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MatchCardSkeleton } from "./skeletons";
import { dateRu } from "@/lib/format";

export function MatchList() {
  const [matches, setMatches] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("v_recent_matches").select("*").limit(30).then(({ data }) => setMatches(data ?? []));
  }, []);
  if (!matches) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><MatchCardSkeleton key={i}/>)}</div>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((m) => (
        <Link key={m.id} href={`/match/${m.id}`} className="card p-5 hover:border-accent/50">
          <div className="label">{m.league_name}</div>
          <div className="mt-3 font-semibold text-white">{m.home_team} {m.home_score ?? ""} : {m.away_score ?? ""} {m.away_team}</div>
          <div className="mt-2 text-sm text-slate-400">{dateRu(m.kickoff_at)}</div>
        </Link>
      ))}
    </div>
  );
}
