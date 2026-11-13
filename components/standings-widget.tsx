"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function StandingsWidget() {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("team_season_stats").select("*, team:teams(name)").order("points", { ascending: false }).limit(10).then(({ data }) => setRows(data ?? []));
  }, []);
  return (
    <div>
      <div className="label mb-2">Таблица</div>
      <div className="card overflow-hidden">
        {!rows ? (
          <div className="space-y-2 p-4">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-8" />)}</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#86868b]">Таблица появится после импорта сезона</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-[#86868b]"><th className="px-4 py-2">#</th><th className="px-2 py-2">Команда</th><th className="px-2 py-2">И</th><th className="px-2 py-2">О</th></tr></thead>
            <tbody className="divide-y divide-black/5">
              {rows.map((r, i) => (
                <tr key={r.id}><td className="px-4 py-2.5 text-[#86868b]">{i + 1}</td><td className="px-2 py-2.5 font-medium">{r.team?.name}</td><td className="px-2 py-2.5">{r.matches ?? 0}</td><td className="px-2 py-2.5 font-semibold">{r.points ?? 0}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
