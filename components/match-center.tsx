"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function MatchCenter({ id }: { id: string }) {
  const [match, setMatch] = useState<any>(null);
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("matches").select("*, home:teams!matches_home_team_id_fkey(name), away:teams!matches_away_team_id_fkey(name), home_id:home_team_id, away_id:away_team_id").eq("id", id).single().then(({ data }) => setMatch(data));
  }, [id]);

  useEffect(() => {
    if (!match?.source_id) return;
    setLoading(true);
    fetch(`/api/match/${match.source_id}/events`)
      .then((r) => r.json())
      .then((d) => setEvents(d))
      .finally(() => setLoading(false));
  }, [match?.source_id]);

  if (!match) return <div className="skeleton h-40" />;
  return (
    <div className="space-y-6">
      <div className="card p-8 text-center">
        <div className="text-2xl font-semibold tracking-tight">{match.home?.name} <span className="mx-3 text-[#86868b]">{match.home_score ?? "–"} : {match.away_score ?? "–"}</span> {match.away?.name}</div>
      </div>
      <div className="flex justify-center gap-2">
        {["events","shots","passes","defense"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab ${tab === t ? "tab-active" : ""}`}>{t === "events" ? "События" : t === "shots" ? "Удары" : t === "passes" ? "Пасы" : "Оборона"}</button>
        ))}
      </div>
      {loading && <div className="skeleton h-64" />}
      {!loading && events && (
        <div className="card divide-y divide-black/5">
          {tab === "events" && events.timeline?.slice(0, 100).map((e: any) => (
            <div key={e.id} className="flex items-center gap-4 p-4 text-sm"><span className="w-10 text-[#86868b]">{e.minute}'</span><span className="font-medium">{e.type}</span><span className="text-[#86868b]">{e.player}</span></div>
          ))}
          {tab === "shots" && events.shots?.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-4 text-sm"><span>{s.minute}' {s.player}</span><span className="font-semibold">xG {Number(s.xg).toFixed(2)}</span><span className="text-[#86868b]">{s.outcome}</span></div>
          ))}
          {tab === "passes" && events.passes?.slice(0, 100).map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 text-sm"><span>{p.minute}' {p.player}</span><span className="text-[#86868b]">→ {p.recipient}</span><span>{p.isKeyPass ? "Key pass" : ""}</span></div>
          ))}
          {tab === "defense" && events.defense?.slice(0, 100).map((d: any) => (
            <div key={d.id} className="flex items-center justify-between p-4 text-sm"><span>{d.minute}' {d.player}</span><span className="font-medium">{d.type}</span><span className="text-[#86868b]">{d.outcome}</span></div>
          ))}
        </div>
      )}
    </div>
  );
}
