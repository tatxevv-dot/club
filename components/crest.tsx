const palette = ["#e5484d", "#f76b15", "#ffb224", "#30a46c", "#0091ff", "#8e4ec6", "#d6409f", "#12a594"];

export function Crest({ name, size = 28 }: { name?: string | null; size?: number }) {
  const n = (name ?? "?").trim() || "?";
  let h = 0;
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  const color = palette[h % palette.length];
  const parts = n.split(/\s+/).filter(Boolean);
  const ini = (parts.length > 1 ? parts[0][0] + parts[1][0] : n.slice(0, 2)).toUpperCase();
  return (
    <span
      aria-hidden
      className="crest"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36), background: `linear-gradient(145deg, ${color}, ${color}88)` }}
    >
      {ini}
    </span>
  );
}
