"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function NewsWidget() {
  const [matches, setMatches] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("v_recent_matches").select("*").order("kickoff_at", { ascending: false }).limit(5).then(({ data }) => setMatches(data ?? []));
  }, []);
  return (
    <div>
      <div className="label mb-2">Новости и результаты</div>
      <div className="card divide-y divide-black/5">
        {!matches ? (
          <div className="space-y-2 p-4">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-10" />)}</div>
        ) : matches.map((m) => (
          <div key={m.id} className="p-4 text-sm">
            <div className="font-medium">{m.home_team} {m.home_score ?? ""} : {m.away_score ?? ""} {m.away_team}</div>
            <div className="text-xs text-[#86868b]">{m.league_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
