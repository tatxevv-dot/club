"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SimilarPage() {
  const { id } = useParams();
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/players/${id}/similar`).then((r) => r.json()).then((d) => setSimilar(d.similar ?? []));
  }, [id]);

  return (
    <div className="container-page space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Похожие игроки</h1>
      <div className="card divide-y divide-black/5">
        {similar.map((p) => (
          <Link key={p.id} href={`/players/${p.id}`} className="flex items-center justify-between p-4 hover:bg-black/[0.03]">
            <div><div className="font-medium">{p.name}</div><div className="text-sm text-[#86868b]">{p.team?.name} · {p.position}</div></div>
            <div className="text-sm text-[#86868b]">similarity {Number(p.similarity).toFixed(2)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
