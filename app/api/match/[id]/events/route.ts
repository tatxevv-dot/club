import { NextResponse } from 'next/server';

const BASE = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const matchId = params.id;
  if (!/^\d+$/.test(matchId)) {
    return NextResponse.json({ error: 'Invalid match id' }, { status: 400 });
  }
  try {
    const res = await fetch(`${BASE}/events/${matchId}.json`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Events not available for this match' }, { status: 404 });
    }
    const events = await res.json();
    const timeline = events.map((e: any) => ({
      id: e.id,
      minute: e.minute,
      second: e.second,
      period: e.period?.name,
      type: e.type?.name,
      team: e.team?.name,
      player: e.player?.name,
      outcome: e.outcome?.name,
      x: e.location?.[0] ?? null,
      y: e.location?.[1] ?? null,
      detail: e.detail ?? null
    }));
    const shots = events.filter((e: any) => e.type?.name === 'Shot').map((e: any) => ({
      id: e.id,
      minute: e.minute,
      player: e.player?.name,
      team: e.team?.name,
      xg: e.shot?.statsbomb_xg ?? 0,
      outcome: e.shot?.outcome?.name,
      bodyPart: e.shot?.body_part?.name,
      technique: e.shot?.technique?.name,
      x: e.location?.[0],
      y: e.location?.[1],
      isPenalty: !!e.shot?.penalty,
      isOwnGoal: !!e.shot?.own_goal
    }));
    const passes = events.filter((e: any) => e.type?.name === 'Pass').map((e: any) => ({
      id: e.id,
      minute: e.minute,
      player: e.player?.name,
      team: e.team?.name,
      recipient: e.pass?.recipient?.name,
      length: e.pass?.length,
      angle: e.pass?.angle,
      isProgressive: !!e.pass?.progressive,
      isKeyPass: !!e.pass?.key_pass,
      isCross: !!e.pass?.cross,
      isThroughBall: !!e.pass?.through_ball,
      underPressure: !!e.under_pressure,
      startX: e.location?.[0],
      startY: e.location?.[1],
      endX: e.pass?.end_location?.[0],
      endY: e.pass?.end_location?.[1]
    }));
    const defense = events.filter((e: any) => ['Tackle','Interception','Clearance','Block','Duel','Pressure','Ball Recovery'].includes(e.type?.name)).map((e: any) => ({
      id: e.id,
      minute: e.minute,
      type: e.type?.name,
      player: e.player?.name,
      team: e.team?.name,
      outcome: e.outcome?.name,
      x: e.location?.[0],
      y: e.location?.[1]
    }));
    return NextResponse.json({ matchId, total: events.length, timeline, shots, passes, defense });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to load events' }, { status: 500 });
  }
}
