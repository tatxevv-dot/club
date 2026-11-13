"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function LeagueProfile({ id }: { id: string }) {
  const [league, setLeague] = useState<any>(null);
  const [matches, setMatches] = useState<any[] | null>(null);
  const [tab, setTab] = useState("matches");
  useEffect(() => {
    supabase.from("leagues").select("*").eq("id", id).single().then(({ data }) => setLeague(data));
    supabase.from("matches").select("*, home:teams!matches_home_team_id_fkey(name), away:teams!matches_away_team_id_fkey(name)").eq("league_id", id).order("kickoff_at", { ascending: false }).limit(30).then(({ data }) => setMatches(data ?? []));
  }, [id]);
  if (!league) return <div className="skeleton h-40" />;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{league.name}</h1>
      <div className="flex gap-2">
        {["matches","table","stats"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab ${tab === t ? "tab-active" : ""}`}>{t === "matches" ? "Матчи" : t === "table" ? "Таблица" : "Статистика"}</button>
        ))}
      </div>
      {tab === "matches" && (
        <div className="space-y-3">
          {matches?.map((m) => (
            <div key={m.id} className="card flex items-center justify-between p-4">
              <div className="flex-1 text-right font-medium">{m.home?.name}</div>
              <div className="mx-4 text-center font-semibold">{m.home_score ?? "–"} : {m.away_score ?? "–"}</div>
              <div className="flex-1 font-medium">{m.away?.name}</div>
            </div>
          ))}
        </div>
      )}
      {tab !== "matches" && <div className="card p-8 text-center text-[#86868b]">Скоро</div>}
    </div>
  );
}
