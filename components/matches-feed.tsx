"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const dayNames = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
const monthNames = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];

export function MatchesFeed() {
  const [selected, setSelected] = useState(new Date());
  const [filter, setFilter] = useState<"all" | "live" | "time">("all");
  const [matches, setMatches] = useState<any[] | null>(null);

  const days = useMemo(() => {
    const arr = [];
    for (let i = -3; i <= 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  useEffect(() => {
    const start = new Date(selected); start.setHours(0,0,0,0);
    const end = new Date(selected); end.setHours(23,59,59,999);
    setMatches(null);
    let q = supabase.from("v_recent_matches").select("*").gte("kickoff_at", start.toISOString()).lte("kickoff_at", end.toISOString()).order("kickoff_at").limit(300);
    if (filter === "live") q = q.eq("status", "IN PLAY");
    q.then(({ data }) => setMatches(data ?? []));
  }, [selected, filter]);

  const grouped = useMemo(() => {
    if (!matches) return null;
    const map = new Map<string, any[]>();
    for (const m of matches) {
      const league = m.league_name || "Другие";
      if (!map.has(league)) map.set(league, []);
      map.get(league)!.push(m);
    }
    return [...map.entries()];
  }, [matches]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Матчи</h1>
        <div className="flex gap-1 rounded-full bg-[#f5f5f7] p-1">
          <button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1.5 text-sm ${filter === "all" ? "bg-white shadow" : "text-[#6e6e73]"}`}>Все</button>
          <button onClick={() => setFilter("live")} className={`rounded-full px-3 py-1.5 text-sm ${filter === "live" ? "bg-white shadow" : "text-[#6e6e73]"}`}>Live</button>
          <button onClick={() => setFilter("time")} className={`rounded-full px-3 py-1.5 text-sm ${filter === "time" ? "bg-white shadow" : "text-[#6e6e73]"}`}>По времени</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => {
          const active = d.toDateString() === selected.toDateString();
          return (
            <button key={d.toISOString()} onClick={() => setSelected(new Date(d))}
              className={`min-w-[64px] rounded-2xl px-3 py-2 text-center transition ${active ? "bg-black text-white" : "bg-[#f5f5f7] hover:bg-black/5"}`}>
              <div className="text-xs opacity-70">{dayNames[d.getDay()]}</div>
              <div className="text-lg font-semibold">{d.getDate()}</div>
              <div className="text-[10px] opacity-60">{monthNames[d.getMonth()]}</div>
            </button>
          );
        })}
      </div>

      {!grouped ? (
        <div className="space-y-3">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-16" />)}</div>
      ) : grouped.length === 0 ? (
        <div className="card p-10 text-center text-[#86868b]">Нет матчей на этот день</div>
      ) : (
        grouped.map(([league, list]) => (
          <section key={league} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#86868b]">{league}</h2>
              <span className="text-xs text-[#86868b]">{list.length}</span>
            </div>
            <div className="card divide-y divide-black/5">
              {list.map((m) => (
                <Link key={m.id} href={`/match/${m.id}`} className="flex items-center justify-between p-4 transition hover:bg-black/[0.02]">
                  <div className="flex-1 text-right"><div className="font-medium">{m.home_team}</div></div>
                  <div className="mx-4 min-w-[84px] text-center">
                    <div className="text-base font-semibold">{m.home_score ?? "–"} : {m.away_score ?? "–"}</div>
                    <div className="text-xs text-[#86868b]">{m.status === "IN PLAY" ? <><span className="live-dot mr-1" />Live</> : new Date(m.kickoff_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div className="flex-1"><div className="font-medium">{m.away_team}</div></div>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
