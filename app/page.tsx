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
    <div className="mx-auto grid max-w-[640px] gap-4 lg:max-w-none lg:grid-cols-[250px_minmax(0,1fr)_330px]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="card">
            <div className="card-head"><h2 className="flex-1 text-[17px] font-semibold">Топ-лиги</h2></div>
            <div className="divide-y divide-line">
              {topLeagues.map((l) => (
                <Link key={l} href="/leagues" className="mrow !py-3.5 text-[15px] font-medium">
                  <Crest name={l} size={26} />
                  <span className="truncate">{l}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2 className="flex-1 text-[17px] font-semibold">Избранное</h2></div>
            <div className="p-4 text-sm leading-relaxed text-muted">Подпишись на команды и лиги, чтобы видеть их первыми.</div>
          </div>
        </div>
      </aside>

      <div>
        <MatchesFeed />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <StandingsWidget />
          <NewsWidget />
        </div>
      </aside>
    </div>
  );
}
