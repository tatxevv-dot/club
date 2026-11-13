import Link from "next/link";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { MatchCardSkeleton } from "@/components/skeletons";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <Hero />
      <Section title="Матчи дня" subtitle="Обновляется автоматически">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)}
        </div>
      </Section>
      <Section title="Топ-5 лиг и Лига чемпионов" subtitle="Полная статистика, события и аналитика">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Premier League","La Liga","Serie A","Bundesliga","Ligue 1","UEFA Champions League"].map((name) => (
            <Link key={name} href={`/leagues`} className="card group p-5 transition hover:-translate-y-1 hover:border-accent/50">
              <div className="text-lg font-semibold text-white">{name}</div>
              <div className="mt-2 text-sm text-slate-400">Таблицы, матчи, игроки, xG и события</div>
              <div className="mt-4 text-sm text-accent group-hover:text-white">Открыть лигу →</div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
