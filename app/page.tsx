import { MatchesFeed } from "@/components/matches-feed";
import { StandingsWidget } from "@/components/standings-widget";
import { NewsWidget } from "@/components/news-widget";
import { Crest } from "@/components/crest";
import Link from "next/link";

const topLeagues = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "UEFA Champions League"
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="animate-rise relative overflow-hidden rounded-[32px] border border-white/10 px-6 py-10 sm:px-10 sm:py-14"
        style={{ background: "radial-gradient(600px 300px at 15% 0%, rgba(0,196,111,.22), transparent 70%), linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))" }}>
        <p className="display">Весь футбол.<br />В одном месте.</p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">Матчи, xG и глубокая аналитика топ-5 лиг и Лиги чемпионов.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/matches" className="btn-primary">Смотреть матчи</Link>
          <Link href="/players" className="btn-ghost">Найти игрока</Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_330px]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <div>
              <div className="label mb-2.5 px-1">Топ-лиги</div>
              <div className="card divide-y divide-white/5">
                {topLeagues.map((l) => (
                  <Link key={l} href="/leagues" className="row !py-3 text-sm font-medium">
                    <Crest name={l} size={24} />
                    <span className="truncate">{l}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="label mb-2.5 px-1">Избранное</div>
              <div className="card p-4 text-sm leading-relaxed text-muted">Подпишись на команды и лиги, чтобы видеть их первыми.</div>
            </div>
          </div>
        </aside>

        <div>
          <MatchesFeed />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <StandingsWidget />
            <NewsWidget />
          </div>
        </aside>
      </div>
    </div>
  );
}
