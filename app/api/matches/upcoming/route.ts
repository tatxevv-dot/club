import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) return NextResponse.json({ error: "FOOTBALL_DATA_API_KEY not set" }, { status: 500 });
  const { searchParams } = new URL(req.url);
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const url = new URL("https://api.football-data.org/v4/matches");
  url.searchParams.set("status", "SCHEDULED");
  if (dateFrom) url.searchParams.set("dateFrom", dateFrom);
  if (dateTo) url.searchParams.set("dateTo", dateTo);
  const r = await fetch(url, { headers: { "X-Auth-Token": key }, cache: "no-store" });
  if (!r.ok) return NextResponse.json({ error: `football-data ${r.status}` }, { status: r.status });
  const d = await r.json();
  return NextResponse.json(d);
}
