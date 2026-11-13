import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Club — футбольная статистика",
  description: "Матчи, игроки, команды, xG и глубокая аналитика топ-лиг."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh pb-20 md:pb-0">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
