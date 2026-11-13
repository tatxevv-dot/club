export const fmt = (n: number | null | undefined, digits = 2) =>
  n === null || n === undefined ? "—" : Number(n).toFixed(digits);

export const pct = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : `${Number(n).toFixed(1)}%`;

export const dateRu = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" }) : "—";
