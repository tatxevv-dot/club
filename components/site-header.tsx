"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const nav = [
  { href: "/", label: "Матчи", prefix: "/match", icon: <Icon><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M12 5v14M2.5 9.5H5v5H2.5M21.5 9.5H19v5h2.5" /><circle cx="12" cy="12" r="2.6" /></Icon> },
  { href: "/leagues", label: "Лиги", prefix: "/league", icon: <Icon><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></Icon> },
  { href: "/teams", label: "Команды", prefix: "/team", icon: <Icon><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" /></Icon> },
  { href: "/players", label: "Игроки", prefix: "/player", icon: <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Icon> }
];

export function SiteHeader() {
  const path = usePathname();
  const isActive = (n: (typeof nav)[number]) => (n.href === "/" ? path === "/" || path.startsWith(n.prefix) : path.startsWith(n.prefix));
  return (
    <>
      <header className="bar sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Club">
            <svg width="30" height="26" viewBox="0 0 26 22" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M4 14 20 8M2 18 14 13M7 10 22 4" /></svg>
            <span className="text-[30px] font-black uppercase leading-none tracking-tight">Club</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`tab ${isActive(n) ? "tab-active" : ""}`}>{n.label}</Link>
            ))}
          </nav>
          <Link href="/players" aria-label="Поиск" className="grid h-10 w-10 place-items-center rounded-full transition active:scale-90">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </Link>
        </div>
      </header>

      <nav className="bar fixed inset-x-0 bottom-0 z-50 border-t border-line md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="grid grid-cols-4">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex flex-col items-center gap-1 pb-3 pt-3 text-[12px] font-semibold transition active:scale-95 ${isActive(n) ? "text-brand" : "text-muted"}`}>
              {n.icon}
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
