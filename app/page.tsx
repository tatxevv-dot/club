"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [matches, setMatches] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("v_recent_matches").select("*").order("kickoff_at", { ascending: false }).limit(12).then(({ data }) => setMatches(data ?? []));
  }, []);
  return (
    <div className="space-y-10">
      <section className="pt-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">Футбол. Без лишнего.</h1>
        <p className="mt-3 max-w-xl text-lg text-[#6e6e73]">Матчи, игроки, команды и глубокая статистика — всё в одном месте.</p>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Матчи</h2>
          <Link href="/matches" className="link text-sm">Все матчи →</Link>
        </div>
        {!matches ? (
          <div className="grid gap-3 sm:grid-cols-2">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-24" />)}</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {matches.map((m) => (
              <Link key={m.id} href={`/match/${m.id}`} className="card p-5 transition hover:shadow-lg">
                <div className="flex items-center justify-between text-xs text-[#86868b]"><span>{m.league_name}</span><span>{m.status === 'IN PLAY' && <span className="live-dot mr-1" />}{m.status}</span></div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium">{m.home_team}</span>
                  <span className="text-lg font-semibold">{m.home_score ?? "–"} : {m.away_score ?? "–"}</span>
                  <span className="font-medium">{m.away_team}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Лиги</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {["Premier League","La Liga","Serie A","Bundesliga","Ligue 1","UEFA Champions League"].map((n) => (
            <Link key={n} href="/leagues" className="card p-5 text-center transition hover:shadow-lg"><div className="font-medium">{n}</div></Link>
          ))}
        </div>
      </section>
    </div>
  );
}
