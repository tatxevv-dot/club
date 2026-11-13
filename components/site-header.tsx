"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/matches", label: "Матчи" },
  { href: "/leagues", label: "Лиги" },
  { href: "/teams", label: "Команды" },
  { href: "/players", label: "Игроки" }
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">Club</Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`tab ${path === n.href ? "tab-active" : ""}`}>{n.label}</Link>
            ))}
          </nav>
          <Link href="/players" className="hidden rounded-full bg-[#0071e3] px-4 py-1.5 text-sm font-medium text-white md:block">Поиск</Link>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/90 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`py-3 text-center text-xs ${path === n.href ? "text-[#0071e3] font-medium" : "text-[#86868b]"}`}>{n.label}</Link>
          ))}
        </div>
      </nav>
    </>
  );
}
