"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const dayNames = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];

export default function HomePage() {
  const [selected, setSelected] = useState(new Date());
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
    const start = new Date(selected);
    start.setHours(0,0,0,0);
    const end = new Date(selected);
    end.setHours(23,59,59,999);
    setMatches(null);
    supabase.from("v_recent_matches")
      .select("*")
      .gte("kickoff_at", start.toISOString())
      .lte("kickoff_at", end.toISOString())
      .order("kickoff_at", { ascending: true })
      .limit(200)
      .then(({ data }) => setMatches(data ?? []));
  }, [selected]);

  const grouped = useMemo(() => {
    if (!matches) return null;
    const map = new Map<string, any[]>();
    for (const m of matches) {
      const key = m.league_name || "Другие";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return [...map.entries()];
  }, [matches]);

  return (
    <div className="space-y-6">
      <div className="sticky top-[57px] z-40 -mx-4 bg-white/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => {
            const active = d.toDateString() === selected.toDateString();
            return (
              <button key={d.toISOString()} onClick={() => setSelected(new Date(d))}
                className={`min-w-[64px] rounded-2xl px-3 py-2 text-center transition ${active ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/5"}`}>
                <div className="text-xs opacity-70">{dayNames[d.getDay()]}</div>
                <div className="text-lg font-semibold">{d.getDate()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {!grouped ? (
        <div className="space-y-3">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-16" />)}</div>
      ) : grouped.length === 0 ? (
        <div className="card p-10 text-center text-[#86868b]">В этот день матчей нет</div>
      ) : (
        grouped.map(([league, list]) => (
          <section key={league} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#86868b]">{league}</h2>
              <span className="text-xs text-[#86868b]">{list.length} матчей</span>
            </div>
            <div className="card divide-y divide-black/5">
              {list.map((m) => (
                <Link key={m.id} href={`/match/${m.id}`} className="flex items-center justify-between p-4 transition hover:bg-black/[0.02]">
                  <div className="flex-1 text-right">
                    <div className="font-medium">{m.home_team}</div>
                  </div>
                  <div className="mx-4 min-w-[80px] text-center">
                    <div className="text-base font-semibold">{m.home_score ?? "–"} : {m.away_score ?? "–"}</div>
                    <div className="text-xs text-[#86868b]">{m.status === "IN PLAY" ? <><span className="live-dot mr-1" />Live</> : new Date(m.kickoff_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{m.away_team}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
