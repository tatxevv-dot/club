import { MatchesFeed } from "@/components/matches-feed";
import { StandingsWidget } from "@/components/standings-widget";
import { NewsWidget } from "@/components/news-widget";
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
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[240px_1fr_320px]">
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-6">
          <div>
            <div className="label mb-2">Top leagues</div>
            <div className="card divide-y divide-black/5">
              {topLeagues.map((l) => (
                <Link key={l} href="/leagues" className="block px-4 py-3 text-sm font-medium transition hover:bg-black/[0.03]">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="label mb-2">Followed</div>
            <div className="card p-4 text-sm text-[#86868b]">Подпишись на команды и лиги, чтобы видеть их первыми.</div>
          </div>
        </div>
      </aside>

      <main>
        <MatchesFeed />
      </main>

      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-6">
          <StandingsWidget />
          <NewsWidget />
        </div>
      </aside>
    </div>
  );
}
