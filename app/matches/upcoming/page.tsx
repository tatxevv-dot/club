"use client";
import { useEffect, useMemo, useState } from "react";

export default function UpcomingPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const in14 = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    fetch(`/api/matches/upcoming?dateFrom=${today}&dateTo=${in14}`)
      .then((r) => r.json())
      .then((d) => setMatches(d.matches ?? []))
      .catch(() => setError("Не удалось загрузить предстоящие матчи"))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const g = new Map<string, any[]>();
    for (const m of matches) {
      const day = (m.utcDate ?? "").slice(0, 10);
      if (!g.has(day)) g.set(day, []);
      g.get(day)!.push(m);
    }
    return [...g.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [matches]);

  return (
    <div className="container-page space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Предстоящие матчи</h1>
      {loading && <div className="skeleton h-96" />}
      {error && <div className="card p-6 text-[#ff3b30]">{error}</div>}
      {!loading && !error && grouped.length === 0 && (
        <div className="card p-8 text-center text-[#86868b]">На ближайшие 14 дней предстоящих матчей нет</div>
      )}
      {!loading && !error && grouped.map(([day, list]) => (
        <div key={day} className="space-y-2">
          <div className="text-sm font-medium text-[#86868b]">{day}</div>
          <div className="card divide-y divide-black/5">
            {list.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 text-sm">
                <div><div className="font-medium">{m.homeTeam?.name} vs {m.awayTeam?.name}</div><div className="text-[#86868b]">{m.competition?.name}</div></div>
                <div className="text-[#86868b]">{new Date(m.utcDate).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
