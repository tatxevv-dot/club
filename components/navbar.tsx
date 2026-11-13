"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Главная" },
  { href: "/matches", label: "Матчи" },
  { href: "/matches/upcoming", label: "Предстоящие" },
  { href: "/players", label: "Игроки" },
  { href: "/teams", label: "Команды" },
  { href: "/top", label: "Топ" },
  { href: "/compare", label: "Сравнение" },
  { href: "/search", label: "Поиск" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="container-page flex items-center gap-6 py-3">
        <Link href="/" className="font-semibold tracking-tight">Football Analytics</Link>
        <div className="flex flex-wrap gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`px-3 py-1.5 rounded-full text-sm ${pathname === l.href ? "bg-black text-white" : "text-[#86868b] hover:bg-black/5"}`}>{l.label}</Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
