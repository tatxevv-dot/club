"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Crest } from "@/components/crest";

const dayNames = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
const monthNames = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];
const tabs = [["all", "Все"], ["live", "Live"], ["time", "По времени"]] as const;

function Status({ m }: { m: any }) {
  if (m.status === "IN PLAY") {
    return <span className="flex flex-col items-center gap-1 text-[11px] font-bold text-brand"><span className="live-dot" />LIVE</span>;
  }
  if (m.home_score != null && m.away_score != null) return <span className="text-[11px] font-semibold text-muted">FT</span>;
  return <span className="text-[13px] font-semibold">{new Date(m.kickoff_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</span>;
}

function MatchRow({ m }: { m: any }) {
  const hs = m.home_score, aw = m.away_score;
  const done = hs != null && aw != null;
  const live = m.status === "IN PLAY";
  const scoreCls = (win: boolean) => `text-[15px] tabular-nums ${live ? "font-bold text-brand" : win ? "font-bold" : done ? "font-medium text-muted" : "text-muted"}`;
  return (
    <Link href={`/match/${m.id}`} className="row">
      <div className="flex w-11 shrink-0 justify-center"><Status m={m} /></div>
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex items-center gap-3"><Crest name={m.home_team} /><span className={`truncate text-[15px] ${done && hs > aw ? "font-semibold" : "font-medium"}`}>{m.home_team}</span></div>
        <div className="flex items-center gap-3"><Crest name={m.away_team} /><span className={`truncate text-[15px] ${done && aw > hs ? "font-semibold" : "font-medium"}`}>{m.away_team}</span></div>
      </div>
      <div className="h-10 w-px shrink-0 bg-white/10" />
      <div className="w-6 shrink-0 space-y-2.5 text-center">
        <div className={scoreCls(done && hs > aw)}>{hs ?? "–"}</div>
        <div className={scoreCls(done && aw > hs)}>{aw ?? "–"}</div>
      </div>
    </Link>
  );
}

export function MatchesFeed() {
  const [selected, setSelected] = useState(new Date());
  const [filter, setFilter] = useState<"all" | "live" | "time">("all");
  const [matches, setMatches] = useState<any[] | null>(null);
  const today = useMemo(() => new Date(), []);

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
    if (filter === "time") return matches.length ? ([["Все матчи по времени", matches]] as [string, any[]][]) : [];
    const map = new Map<string, any[]>();
    for (const m of matches) {
      const league = m.league_name || "Другие";
      if (!map.has(league)) map.set(league, []);
      map.get(league)!.push(m);
    }
    return [...map.entries()];
  }, [matches, filter]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="label" suppressHydrationWarning>{selected.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}</div>
          <h1 className="text-[30px] font-bold leading-tight tracking-tight">Матчи</h1>
        </div>
        <div className="seg">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`seg-btn ${filter === k ? "seg-btn-active" : ""}`}>
              {k === "live" && <span className="live-dot" />}{label}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {days.map((d) => {
          const active = d.toDateString() === selected.toDateString();
          const isToday = d.toDateString() === today.toDateString();
          return (
            <button key={d.toISOString()} onClick={() => setSelected(new Date(d))} className={`day ${active ? "day-active" : ""}`}>
              <div className="text-[11px] font-medium opacity-80">{isToday ? "Сегодня" : dayNames[d.getDay()]}</div>
              <div className="text-xl font-bold leading-tight tabular-nums">{d.getDate()}</div>
              <div className="text-[10px] opacity-70">{monthNames[d.getMonth()]}</div>
            </button>
          );
        })}
      </div>

      {!grouped ? (
        <div className="space-y-3">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-[84px]" />)}</div>
      ) : grouped.length === 0 ? (
        <div className="card animate-rise p-12 text-center">
          <div className="text-4xl">⚽</div>
          <div className="mt-3 font-semibold">Нет матчей на этот день</div>
          <div className="mt-1 text-sm text-muted">Выбери другую дату в календаре выше</div>
        </div>
      ) : (
        grouped.map(([league, list], gi) => (
          <section key={league} className="card animate-rise" style={{ animationDelay: `${Math.min(gi, 8) * 50}ms` }}>
            <div className="league-head">
              <Crest name={league} size={24} />
              <h2 className="flex-1 truncate text-sm font-semibold tracking-tight">{league}</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-muted">{list.length}</span>
            </div>
            <div className="divide-y divide-white/5">
              {list.map((m) => <MatchRow key={m.id} m={m} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
