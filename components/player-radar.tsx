"use client";
export function PlayerRadar({ a, b, nameA, nameB }: { a: any; b: any; nameA: string; nameB: string }) {
  const metrics = [
    { key: "goals", label: "Голы", max: 30 },
    { key: "assists", label: "Ассисты", max: 20 },
    { key: "xg", label: "xG", max: 30 },
    { key: "xa", label: "xA", max: 20 },
    { key: "shots", label: "Удары", max: 120 },
    { key: "key_passes", label: "Ключевые пасы", max: 80 },
    { key: "progressive_passes", label: "Прогрессивные пасы", max: 200 },
    { key: "tackles", label: "Отборы", max: 100 },
    { key: "interceptions", label: "Перехваты", max: 80 },
    { key: "rating", label: "Рейтинг", max: 10 },
  ];
  const norm = (v: any, max: number) => Math.max(0, Math.min(1, Number(v ?? 0) / max));
  const cx = 150, cy = 150, r = 110;
  const angle = (i: number) => (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
  const point = (i: number, val: number) => [cx + r * val * Math.cos(angle(i)), cy + r * val * Math.sin(angle(i))];
  const path = (p: any) => metrics.map((m, i) => point(i, norm(p[m.key], m.max)).join(",")).join(" ");
  return (
    <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-md">
      {[0.25, 0.5, 0.75, 1].map((g) => <circle key={g} cx={cx} cy={cy} r={r * g} fill="none" stroke="rgba(0,0,0,0.08)" />)}
      {metrics.map((m, i) => {
        const [x, y] = point(i, 1);
        return <line key={m.key} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(0,0,0,0.08)" />;
      })}
      <polygon points={path(a)} fill="rgba(0,122,255,0.25)" stroke="#007aff" strokeWidth="2" />
      <polygon points={path(b)} fill="rgba(255,59,48,0.2)" stroke="#ff3b30" strokeWidth="2" />
      {metrics.map((m, i) => {
        const [x, y] = point(i, 1.18);
        return <text key={m.key} x={x} y={y} fontSize="9" textAnchor="middle" fill="#86868b">{m.label}</text>;
      })}
      <text x={cx} y={285} fontSize="11" fill="#007aff" textAnchor="middle">{nameA}</text>
      <text x={cx} y={298} fontSize="11" fill="#ff3b30" textAnchor="middle">{nameB}</text>
    </svg>
  );
}
