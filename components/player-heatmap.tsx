"use client";
export function PlayerHeatmap({ events }: { events: any[] }) {
  return (
    <svg viewBox="0 0 100 68" className="mx-auto w-full max-w-2xl rounded-2xl bg-[#0b7a3b]">
      <rect x="0" y="0" width="100" height="68" fill="none" stroke="white" strokeWidth="0.5" />
      <line x1="50" y1="0" x2="50" y2="68" stroke="white" strokeWidth="0.5" />
      <circle cx="50" cy="34" r="9" fill="none" stroke="white" strokeWidth="0.5" />
      {events.slice(0, 500).map((e, i) => (
        <circle key={i} cx={e.x} cy={68 - e.y} r="2" fill="rgba(255,59,48,0.35)" />
      ))}
    </svg>
  );
}
