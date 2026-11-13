"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function PlayerProfile({ id }: { id: string }) {
  const [player, setPlayer] = useState<any>(null);
  const [season, setSeason] = useState<any>(null);
  const [tab, setTab] = useState("overview");
  useEffect(() => {
    supabase.from("players").select("*").eq("id", id).single().then(({ data }) => setPlayer(data));
    supabase.from("player_season_stats").select("*").eq("player_id", id).limit(1).then(({ data }) => setSeason(data?.[0] ?? null));
  }, [id]);
  if (!player) return <div className="skeleton h-64" />;
  return (
    <div className="space-y-6">
      <div className="card p-8 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-[#f5f5f7]" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{player.full_name}</h1>
        <p className="text-[#86868b]">{player.position ?? "—"}</p>
      </div>
      <div className="flex justify-center gap-2">
        {["overview","matches","stats"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`tab ${tab === t ? "tab-active" : ""}`}>{t === "overview" ? "Обзор" : t === "matches" ? "Матчи" : "Статистика"}</button>
        ))}
      </div>
      <div className="card p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div><div className="label">Матчи</div><div className="stat">{season?.appearances ?? "—"}</div></div>
          <div><div className="label">Голы</div><div className="stat">{season?.goals ?? "—"}</div></div>
          <div><div className="label">Ассисты</div><div className="stat">{season?.assists ?? "—"}</div></div>
          <div><div className="label">xG</div><div className="stat">{season?.xg ?? "—"}</div></div>
        </div>
      </div>
    </div>
  );
}
