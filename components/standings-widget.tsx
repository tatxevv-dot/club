"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Crest } from "@/components/crest";

export function StandingsWidget() {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    supabase.from("team_season_stats").select("*, team:teams(name)").order("points", { ascending: false }).limit(10).then(({ data }) => setRows(data ?? []));
  }, []);
  return (
    <div className="card">
      <div className="card-head"><h2 className="flex-1 text-[17px] font-semibold">Таблица</h2></div>
      {!rows ? (
        <div className="space-y-2 p-4">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-8" />)}</div>
      ) : rows.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted">Таблица появится после импорта сезона</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[12px] font-semibold text-muted">
              <th className="py-3 pl-4 pr-1">#</th><th className="px-2 py-3">Команда</th><th className="px-2 py-3 text-center">И</th><th className="py-3 pl-2 pr-4 text-center">О</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r, i) => (
              <tr key={r.id} className="transition hover:bg-white/[0.03]">
                <td className="relative py-3 pl-4 pr-1 tabular-nums text-muted">
                  <span className={`absolute inset-y-2.5 left-0 w-[3px] rounded-r-full ${i < 4 ? "bg-brand" : i < 6 ? "bg-accent2" : "bg-transparent"}`} />
                  {i + 1}
                </td>
                <td className="px-2 py-3"><div className="flex items-center gap-2.5"><Crest name={r.team?.name} size={22} /><span className="truncate font-medium">{r.team?.name}</span></div></td>
                <td className="px-2 py-3 text-center tabular-nums text-muted">{r.matches ?? 0}</td>
                <td className="py-3 pl-2 pr-4 text-center font-bold tabular-nums">{r.points ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
