"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function MatchCenter({ id }: { id: string }) {
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<any[] | null>(null);
  const [tab, setTab] = useState("events");
  useEffect(() => {
    supabase.from("matches").select("*, home:teams!matches_home_team_id_fkey(name), away:teams!matches_away_team_id_fkey(name)").eq("id", id).single().then(({ data }) => setMatch(data));
    supabase.from("match_events").select("*").eq("match_id", id).order("minute").then(({ data }) => setEvents(data ?? []));
  }, [id]);
  if (!match) return <div className="skeleton h-40" />;
  return (
    <div className="space-y-6">
      <div className="card p-8 text-center">
        <div className="text-2xl font-semibold tracking-tight">{match.home?.name} <span className="mx-3 text-[#86868b]">{match.home_score ?? "–"} : {match.away_score ?? "–"}</span> {match.away?.name}</div>
      </div>
      <div className="flex justify-center gap-2">
        {["events","lineups","stats"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab ${tab === t ? "tab-active" : ""}`}>{t === "events" ? "События" : t === "lineups" ? "Составы" : "Статистика"}</button>
        ))}
      </div>
      {tab === "events" && (
        <div className="card divide-y divide-black/5">
          {events?.length ? events.map((e) => (
            <div key={e.id} className="flex items-center gap-4 p-4 text-sm"><span className="w-10 text-[#86868b]">{e.minute}'</span><span className="font-medium">{e.event_type}</span></div>
          )) : <div className="p-8 text-center text-[#86868b]">События скоро появятся</div>}
        </div>
      )}
      {tab !== "events" && <div className="card p-8 text-center text-[#86868b]">Скоро</div>}
    </div>
  );
}
