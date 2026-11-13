"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export function MatchList() {
  const [matches, setMatches] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("v_recent_matches").select("*").order("kickoff_at", { ascending: false }).limit(50).then(({ data }) => setMatches(data ?? []));
  }, []);
  if (!matches) return <div className="space-y-3">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-20" />)}</div>;
  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <Link key={m.id} href={`/match/${m.id}`} className="card flex items-center justify-between p-4 transition hover:shadow-lg">
          <div className="flex-1 text-right"><div className="font-medium">{m.home_team}</div></div>
          <div className="mx-4 min-w-[70px] text-center"><div className="text-lg font-semibold">{m.home_score ?? "–"} : {m.away_score ?? "–"}</div><div className="text-xs text-[#86868b]">{m.league_name}</div></div>
          <div className="flex-1"><div className="font-medium">{m.away_team}</div></div>
        </Link>
      ))}
    </div>
  );
}
