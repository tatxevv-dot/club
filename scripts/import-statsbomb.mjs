import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');

const sb = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const BASE = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data';

const upsert = async (table, rows, conflict) => {
  if (!rows.length) return;
  const { error } = await sb.from(table).upsert(rows, conflict ? { onConflict: conflict } : {});
  if (error) throw new Error(`${table}: ${error.message}`);
};

const competitions = await (await fetch(`${BASE}/competitions.json`)).json();
const wanted = new Set(['Premier League','La Liga','Serie A','Bundesliga','Ligue 1','UEFA Champions League']);
const comps = competitions.filter(c => wanted.has(c.competition_name));

for (const c of comps) {
  const league = { source: 'statsbomb', source_id: String(c.competition_id), name: c.competition_name || `Competition ${c.competition_id}`, country: c.country_name, type: c.competition_type };
  await upsert('leagues', [league], 'source,source_id');
  const { data: leagueRow, error: leagueError } = await sb.from('leagues').select('id').eq('source','statsbomb').eq('source_id',String(c.competition_id)).single();
  if (leagueError) throw leagueError;
  const season = { source: 'statsbomb', source_id: `${c.competition_id}-${c.season_id}`, league_id: leagueRow.id, name: c.season_name || `Season ${c.season_id}`, start_date: c.season_start_date, end_date: c.season_end_date, is_current: false };
  await upsert('seasons', [season], 'source,source_id');
  const { data: seasonRow, error: seasonError } = await sb.from('seasons').select('id').eq('source','statsbomb').eq('source_id',season.source_id).single();
  if (seasonError) throw seasonError;
  const matches = await (await fetch(`${BASE}/matches/${c.competition_id}/${c.season_id}.json`)).json();
  const teams = new Map();
  const matchRows = [];
  for (const m of matches) {
    const home = m.home_team;
    const away = m.away_team;
    teams.set(String(home.home_team_id), { source:'statsbomb', source_id:String(home.home_team_id), name: home.home_team_name || `Team ${home.home_team_id}`, country: home.country?.name ?? null });
    teams.set(String(away.away_team_id), { source:'statsbomb', source_id:String(away.away_team_id), name: away.away_team_name || `Team ${away.away_team_id}`, country: away.country?.name ?? null });
    matchRows.push({ source:'statsbomb', source_id:String(m.match_id), league_id:leagueRow.id, season_id:seasonRow.id, home_team_id:null, away_team_id:null, kickoff_at:m.match_date ? new Date(m.match_date+'T'+(m.kick_off||'00:00:00')+'Z').toISOString() : null, status:m.match_status, home_score:m.home_score, away_score:m.away_score, stage:m.competition_stage?.name, round:m.match_week ? `Matchweek ${m.match_week}` : null, venue:m.stadium?.name, referee:m.referee?.name, raw:m });
  }
  await upsert('teams', [...teams.values()], 'source,source_id');
  const { data: teamRows, error: teamError } = await sb.from('teams').select('id,source_id').eq('source','statsbomb');
  if (teamError) throw teamError;
  const teamId = new Map(teamRows.map(t => [t.source_id, t.id]));
  for (const r of matchRows) {
    r.home_team_id = teamId.get(String(r.raw.home_team.home_team_id));
    r.away_team_id = teamId.get(String(r.raw.away_team.away_team_id));
  }
  await upsert('matches', matchRows, 'source,source_id');
  const { data: matchRowsDb, error: matchError } = await sb.from('matches').select('id,source_id').eq('source','statsbomb');
  if (matchError) throw matchError;
  const matchId = new Map(matchRowsDb.map(m => [m.source_id, m.id]));

  for (const m of matches) {
    const mid = matchId.get(String(m.match_id));
    if (!mid) continue;

    const lineups = await (await fetch(`${BASE}/lineups/${m.match_id}.json`)).json();
    const players = new Map();
    const lineupRows = [];
    for (const side of lineups) {
      const teamKey = String(side.team_id);
      for (const p of side.lineup ?? []) {
        players.set(String(p.player_id), { source:'statsbomb', source_id:String(p.player_id), full_name: p.player_name || `Player ${p.player_id}`, known_name: p.player_nickname || p.player_name || `Player ${p.player_id}`, position:p.position?.name ?? null });
        lineupRows.push({ match_id:mid, team_id:teamId.get(teamKey), player_id:null, is_starter:p.starting_lineup ?? false, position:p.position?.name ?? null, shirt_number:p.jersey_number ?? null, raw:p });
      }
    }
    await upsert('players', [...players.values()], 'source,source_id');
    const { data: playerRows, error: playerError } = await sb.from('players').select('id,source_id').eq('source','statsbomb');
    if (playerError) throw playerError;
    const playerId = new Map(playerRows.map(p => [p.source_id, p.id]));
    for (const l of lineupRows) l.player_id = playerId.get(String(l.raw.player_id));
    if (lineupRows.length) {
      const { error } = await sb.from('match_lineups').upsert(lineupRows, { onConflict: 'match_id,player_id' });
      if (error) console.warn('lineups', error.message);
    }

    const events = await (await fetch(`${BASE}/events/${m.match_id}.json`)).json();
    const eventRows = [];
    const shotRows = [];
    const passRows = [];
    const defRows = [];
    for (const e of events) {
      const base = {
        match_id: mid,
        source: 'statsbomb',
        source_event_id: String(e.id),
        minute: e.minute ?? null,
        second: e.second ?? null,
        period: e.period?.name ?? null,
        event_type: e.type?.name ?? 'Unknown',
        team_id: teamId.get(String(e.team?.id)),
        player_id: playerId.get(String(e.player?.id)),
        related_player_id: e.related_player ? playerId.get(String(e.related_player.id)) : null,
        outcome: e.outcome?.name ?? null,
        start_x: e.location?.[0] ?? null,
        start_y: e.location?.[1] ?? null,
        end_x: e.pass?.end_location?.[0] ?? null,
        end_y: e.pass?.end_location?.[1] ?? null,
        detail: e.detail ?? null,
        raw: e
      };
      eventRows.push(base);
      if (base.event_type === 'Shot') {
        shotRows.push({ match_id: mid, event_id: null, player_id: base.player_id, team_id: base.team_id, minute: base.minute, x: base.start_x, y: base.start_y, xg: e.shot?.statsbomb_xg ?? null, outcome: base.outcome, body_part: e.shot?.body_part?.name ?? null, technique: e.shot?.technique?.name ?? null, is_penalty: !!e.shot?.penalty, is_own_goal: !!e.shot?.own_goal, assist_player_id: e.pass?.assisted_shot_id ? playerId.get(String(e.pass.assisted_shot_id)) : null, freeze_frame: e.shot?.freeze_frame ?? null, raw: e });
      }
      if (base.event_type === 'Pass') {
        passRows.push({ match_id: mid, event_id: null, player_id: base.player_id, recipient_player_id: e.pass?.recipient ? playerId.get(String(e.pass.recipient.id)) : null, team_id: base.team_id, minute: base.minute, start_x: base.start_x, start_y: base.start_y, end_x: base.end_x, end_y: base.end_y, length: e.pass?.length ?? null, angle: e.pass?.angle ?? null, is_progressive: !!e.pass?.progressive, is_key_pass: !!e.pass?.key_pass, is_cross: !!e.pass?.cross, is_through_ball: !!e.pass?.through_ball, is_switch: !!e.pass?.switch, under_pressure: !!e.under_pressure, outcome: base.outcome, raw: e });
      }
      if (['Tackle','Interception','Clearance','Block','Duel','Pressure','Ball Recovery'].includes(base.event_type)) {
        defRows.push({ match_id: mid, event_id: null, player_id: base.player_id, team_id: base.team_id, minute: base.minute, event_type: base.event_type, x: base.start_x, y: base.start_y, outcome: base.outcome, raw: e });
      }
    }
    if (eventRows.length) {
      const { error } = await sb.from('match_events').upsert(eventRows, { onConflict: 'source,source_event_id' });
      if (error) console.warn('events', error.message);
    }
    if (shotRows.length) {
      const { error } = await sb.from('shot_events').upsert(shotRows, { onConflict: 'id' });
      if (error) console.warn('shots', error.message);
    }
    if (passRows.length) {
      const { error } = await sb.from('pass_events').upsert(passRows, { onConflict: 'id' });
      if (error) console.warn('passes', error.message);
    }
    if (defRows.length) {
      const { error } = await sb.from('defensive_events').upsert(defRows, { onConflict: 'id' });
      if (error) console.warn('defense', error.message);
    }
    console.log(`Imported ${eventRows.length} events for match ${m.match_id}`);
  }
  console.log(`Finished ${c.competition_name} ${c.season_name}`);
}
