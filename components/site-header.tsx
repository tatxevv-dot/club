"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const nav = [
  { href: "/", label: "Главная", icon: <Icon><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></Icon> },
  { href: "/matches", label: "Матчи", icon: <Icon><rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M3 9.5h18M8 3v3M16 3v3" /></Icon> },
  { href: "/leagues", label: "Лиги", icon: <Icon><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></Icon> },
  { href: "/teams", label: "Команды", icon: <Icon><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" /></Icon> },
  { href: "/players", label: "Игроки", icon: <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Icon> }
];

export function SiteHeader() {
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-b from-[#10d985] to-[#00985f] text-sm font-black text-white shadow-[0_6px_18px_-6px_rgba(0,196,111,.8)]">C</span>
            <span className="text-lg font-bold tracking-tight">Club</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`tab ${isActive(n.href) ? "tab-active" : ""}`}>{n.label}</Link>
            ))}
          </nav>
          <Link href="/players" className="btn-primary !px-4 !py-2">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            Поиск
          </Link>
        </div>
      </header>

      <nav className="glass fixed inset-x-3 bottom-3 z-50 rounded-[28px] shadow-[0_20px_50px_-12px_rgba(0,0,0,.8)] md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        <div className="grid grid-cols-5 p-1.5">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex flex-col items-center gap-1 rounded-[22px] py-2 text-[10px] font-medium transition ${isActive(n.href) ? "bg-white/10 text-brand" : "text-muted"}`}>
              {n.icon}
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
