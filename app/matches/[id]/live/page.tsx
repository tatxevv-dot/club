"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LivePage() {
  const { id } = useParams();
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("matches").select("*,home:teams!matches_home_team_id_fkey(name),away:teams!matches_away_team_id_fkey(name)").eq("id", id).single();
      setMatch(data);
      if (data?.source_id) {
        const r = await fetch(`/api/match/${data.source_id}/events`);
        const d = await r.json();
        setEvents(d.timeline ?? []);
      }
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [id]);

  if (!match) return <div className="skeleton h-40" />;

  return (
    <div className="container-page space-y-6">
      <div className="card p-8 text-center">
        <div className="text-xs uppercase tracking-widest text-[#ff3b30]">● Live</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{match.home?.name} <span className="mx-4">{match.home_score ?? 0} : {match.away_score ?? 0}</span> {match.away?.name}</div>
      </div>
      <div className="card divide-y divide-black/5">
        {events.slice(0, 50).map((e) => (
          <div key={e.id} className="flex items-center gap-4 p-3 text-sm"><span className="w-10 text-[#86868b]">{e.minute}'</span><span className="font-medium">{e.type}</span><span className="text-[#86868b]">{e.player}</span></div>
        ))}
      </div>
    </div>
  );
}
