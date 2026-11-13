import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "FootballStats — полная футбольная аналитика",
  description: "Игроки, команды, матчи, xG, shotmaps, event data и глубокая статистика топ-5 лиг и ЛЧ."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(34,211,238,.16),transparent),radial-gradient(60%_50%_at_90%_10%,rgba(163,230,53,.08),transparent)]" />
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
