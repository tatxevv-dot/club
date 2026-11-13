"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function MatchCenter({ id }: { id: string }) {
  const [match, setMatch] = useState<any>(null);
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("matches").select("*, home:teams!matches_home_team_id_fkey(name), away:teams!matches_away_team_id_fkey(name)").eq("id", id).single().then(({ data }) => setMatch(data));
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

  const tabs = ["events","shots","passes","defense","shotmap","network","pressure"];
  const labels: Record<string,string> = { events:"События", shots:"Удары", passes:"Пасы", defense:"Оборона", shotmap:"Shotmap", network:"Passing network", pressure:"Pressure map" };

  return (
    <div className="space-y-6">
      <div className="card p-8 text-center">
        <div className="text-2xl font-semibold tracking-tight">{match.home?.name} <span className="mx-3 text-[#86868b]">{match.home_score ?? "–"} : {match.away_score ?? "–"}</span> {match.away?.name}</div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab ${tab === t ? "tab-active" : ""}`}>{labels[t]}</button>
        ))}
      </div>
      {loading && <div className="skeleton h-96" />}
      {!loading && events && (
        <div className="card p-4">
          {tab === "events" && (
            <div className="divide-y divide-black/5">
              {events.timeline?.slice(0, 100).map((e: any) => (
                <div key={e.id} className="flex items-center gap-4 p-3 text-sm"><span className="w-10 text-[#86868b]">{e.minute}'</span><span className="font-medium">{e.type}</span><span className="text-[#86868b]">{e.player}</span></div>
              ))}
            </div>
          )}
          {tab === "shots" && (
            <div className="divide-y divide-black/5">
              {events.shots?.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 text-sm"><span>{s.minute}' {s.player}</span><span className="font-semibold">xG {Number(s.xg).toFixed(2)}</span><span className="text-[#86868b]">{s.outcome}</span></div>
              ))}
            </div>
          )}
          {tab === "passes" && (
            <div className="divide-y divide-black/5">
              {events.passes?.slice(0, 100).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 text-sm"><span>{p.minute}' {p.player}</span><span className="text-[#86868b]">→ {p.recipient}</span><span>{p.isKeyPass ? "Key pass" : ""}</span></div>
              ))}
            </div>
          )}
          {tab === "defense" && (
            <div className="divide-y divide-black/5">
              {events.defense?.slice(0, 100).map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-3 text-sm"><span>{d.minute}' {d.player}</span><span className="font-medium">{d.type}</span><span className="text-[#86868b]">{d.outcome}</span></div>
              ))}
            </div>
          )}
          {tab === "shotmap" && <Shotmap shots={events.shots ?? []} />}
          {tab === "network" && <PassingNetwork passes={events.passes ?? []} />}
          {tab === "pressure" && <PressureMap defense={events.defense ?? []} />}
        </div>
      )}
    </div>
  );
}

function Pitch({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 68" className="mx-auto w-full max-w-2xl rounded-2xl bg-[#0b7a3b]">
      <rect x="0" y="0" width="100" height="68" fill="none" stroke="white" strokeWidth="0.5" />
      <line x1="50" y1="0" x2="50" y2="68" stroke="white" strokeWidth="0.5" />
      <circle cx="50" cy="34" r="9" fill="none" stroke="white" strokeWidth="0.5" />
      <rect x="0" y="20" width="14" height="28" fill="none" stroke="white" strokeWidth="0.5" />
      <rect x="86" y="20" width="14" height="28" fill="none" stroke="white" strokeWidth="0.5" />
      {children}
    </svg>
  );
}

function Shotmap({ shots }: { shots: any[] }) {
  return (
    <div>
      <p className="mb-3 text-center text-sm text-[#86868b]">Размер круга = xG</p>
      <Pitch>
        {shots.map((s) => (
          <circle key={s.id} cx={s.x} cy={68 - s.y} r={Math.max(1, Math.min(4, Number(s.xg) * 12))} fill={s.outcome === "Goal" ? "#ff3b30" : "rgba(255,255,255,0.7)"} stroke="white" strokeWidth="0.4" />
        ))}
      </Pitch>
    </div>
  );
}

function PassingNetwork({ passes }: { passes: any[] }) {
  const nodes = new Map<string, {x:number;y:number;n:number}>();
  for (const p of passes) {
    if (!p.player || !p.startX) continue;
    const key = p.player;
    const cur = nodes.get(key) ?? { x: 0, y: 0, n: 0 };
    cur.x += p.startX; cur.y += p.startY; cur.n += 1;
    nodes.set(key, cur);
  }
  const arr = [...nodes.entries()].map(([name, v]) => ({ name, x: v.x / v.n, y: 68 - v.y / v.n, n: v.n }));
  const find = (name: string) => arr.find((a) => a.name === name);
  return (
    <div>
      <p className="mb-3 text-center text-sm text-[#86868b]">Средние позиции и связи между игроками</p>
      <Pitch>
        {passes.slice(0, 400).map((p, i) => {
          const a = find(p.player); const b = find(p.recipient);
          if (!a || !b) return null;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />;
        })}
        {arr.map((n) => (
          <g key={n.name}><circle cx={n.x} cy={n.y} r={Math.max(1.2, Math.min(3, n.n / 12))} fill="white" /><text x={n.x} y={n.y - 2} fontSize="1.6" fill="white" textAnchor="middle">{n.name.split(" ").pop()}</text></g>
        ))}
      </Pitch>
    </div>
  );
}

function PressureMap({ defense }: { defense: any[] }) {
  return (
    <div>
      <p className="mb-3 text-center text-sm text-[#86868b]">Зоны защитных действий и давления</p>
      <Pitch>
        {defense.slice(0, 500).map((d, i) => (
          <circle key={i} cx={d.x} cy={68 - d.y} r="1.4" fill="rgba(255,59,48,0.55)" />
        ))}
      </Pitch>
    </div>
  );
}
