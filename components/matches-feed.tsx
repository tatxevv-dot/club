"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Crest } from "@/components/crest";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function dayLabel(d: Date) {
  const t = new Date();
  const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()) / 86400000);
  if (diff === 0) return "Сегодня";
  if (diff === -1) return "Вчера";
  if (diff === 1) return "Завтра";
  return d.toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" });
}

const Chev = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
  </svg>
);

function Left({ m }: { m: any }) {
  if (m.status === "IN PLAY") return <span className="badge-live">{m.minute ?? "Live"}</span>;
  if (m.home_score != null && m.away_score != null) return <span className="text-[12px] font-semibold text-muted">FT</span>;
  return null;
}

function MatchRow({ m }: { m: any }) {
  const done = m.home_score != null && m.away_score != null;
  const live = m.status === "IN PLAY";
  const time = new Date(m.kickoff_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return (
    <Link href={`/match/${m.id}`} className="mrow">
      <div className="flex w-10 shrink-0 justify-start"><Left m={m} /></div>
      <div className="min-w-0 flex-1 text-right text-[14px] font-medium leading-tight">{m.home_team}</div>
      <Crest name={m.home_team} size={26} />
      <div className="w-[58px] shrink-0 text-center tabular-nums">
        {done || live ? (
          <span className="text-[16px] font-bold">{m.home_score ?? 0} - {m.away_score ?? 0}</span>
        ) : (
          <span className="text-[13px] font-semibold text-muted" suppressHydrationWarning>{time}</span>
        )}
      </div>
      <Crest name={m.away_team} size={26} />
      <div className="min-w-0 flex-1 text-left text-[14px] font-medium leading-tight">{m.away_team}</div>
      <div className="w-10 shrink-0" />
    </Link>
  );
}

function LeagueCard({ name, list, delay }: { name: string; list: any[]; delay: number }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="card animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="card-head w-full text-left">
        <Crest name={name} size={26} />
        <h2 className="flex-1 truncate text-[17px] font-semibold">{name}</h2>
        <svg viewBox="0 0 24 24" width="22" height="22" className={`text-muted transition-transform duration-300 ${open ? "" : "rotate-180"}`}><path d="M12 8 4.5 16h15z" fill="currentColor" /></svg>
      </button>
      <div className="collapse" data-closed={!open}>
        <div>
          <div className="divide-y divide-line">
            {list.map((m) => <MatchRow key={m.id} m={m} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MatchesFeed() {
  const [selected, setSelected] = useState(new Date());
  const [filter, setFilter] = useState<"all" | "live" | "time">("all");
  const [matches, setMatches] = useState<any[] | null>(null);

  const shift = (n: number) => setSelected((d) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; });

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
    if (filter === "time") return matches.length ? ([["По времени", matches]] as [string, any[]][]) : [];
    const map = new Map<string, any[]>();
    for (const m of matches) {
      const league = m.league_name || "Другие";
      if (!map.has(league)) map.set(league, []);
      map.get(league)!.push(m);
    }
    return [...map.entries()];
  }, [matches, filter]);

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="flex items-center gap-3 px-4 py-4">
          <button className="circle-btn" aria-label="Предыдущий день" onClick={() => shift(-1)}><Chev dir="left" /></button>
          <div className="relative flex flex-1 items-center justify-center gap-2 text-[22px] font-semibold">
            <span suppressHydrationWarning>{dayLabel(selected)}</span>
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="m5 9 7 8 7-8z" fill="currentColor" /></svg>
            <input
              type="date"
              aria-label="Выбрать дату"
              value={iso(selected)}
              onChange={(e) => {
                if (!e.target.value) return;
                const [y, mo, d] = e.target.value.split("-").map(Number);
                setSelected(new Date(y, mo - 1, d));
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <button className="circle-btn" aria-label="Следующий день" onClick={() => shift(1)}><Chev dir="right" /></button>
        </div>
        <div className="h-px bg-line" />
        <div className="flex items-center gap-3 px-4 py-4">
          <button className={`pill ${filter === "live" ? "pill-on" : ""}`} onClick={() => setFilter(filter === "live" ? "all" : "live")}>
            <span className={`h-3 w-3 rounded-full ${filter === "live" ? "bg-[var(--brand-ink)]" : "bg-muted"}`} />
            Live
          </button>
          <button className={`pill ${filter === "time" ? "pill-on" : ""}`} onClick={() => setFilter(filter === "time" ? "all" : "time")}>
            По времени
          </button>
          <button className="circle-btn" aria-label="Сегодня" onClick={() => setSelected(new Date())}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
          </button>
        </div>
      </div>

      {!grouped ? (
        <div className="space-y-3">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-[120px]" />)}</div>
      ) : grouped.length === 0 ? (
        <div className="card animate-rise p-10 text-center">
          <div className="font-semibold">Нет матчей на этот день</div>
          <div className="mt-1 text-sm text-muted">Переключи день стрелками выше</div>
        </div>
      ) : (
        grouped.map(([league, list], gi) => <LeagueCard key={league} name={league} list={list} delay={Math.min(gi, 8) * 40} />)
      )}
    </div>
  );
}
