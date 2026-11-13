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

const upsert = async (table, rows) => {
  if (!rows.length) return;
  const { error } = await sb.from(table).upsert(rows, { onConflict: 'source,source_id' });
  if (error) throw new Error(`${table}: ${error.message}`);
};

const competitions = await (await fetch(`${BASE}/competitions.json`)).json();
const wanted = new Set(['Premier League','La Liga','Serie A','Bundesliga','Ligue 1','UEFA Champions League']);
const comps = competitions.filter(c => wanted.has(c.competition_name));

for (const c of comps) {
  const league = { source: 'statsbomb', source_id: String(c.competition_id), name: c.competition_name, country: c.country_name, type: c.competition_type };
  await upsert('leagues', [league]);
  const { data: leagueRow, error: leagueError } = await sb.from('leagues').select('id').eq('source','statsbomb').eq('source_id',String(c.competition_id)).single();
  if (leagueError) throw leagueError;
  const season = { source: 'statsbomb', source_id: `${c.competition_id}-${c.season_id}`, league_id: leagueRow.id, name: c.season_name, start_date: c.season_start_date, end_date: c.season_end_date, is_current: false };
  await upsert('seasons', [season]);
  const { data: seasonRow, error: seasonError } = await sb.from('seasons').select('id').eq('source','statsbomb').eq('source_id',season.source_id).single();
  if (seasonError) throw seasonError;
  const matches = await (await fetch(`${BASE}/matches/${c.competition_id}/${c.season_id}.json`)).json();
  const teams = new Map();
  const players = new Map();
  const matchRows = [];
  for (const m of matches) {
    for (const side of [m.home_team, m.away_team]) teams.set(String(side.team_id), { source:'statsbomb', source_id:String(side.team_id), name:side.team_name, country:side.country?.name ?? null });
    matchRows.push({ source:'statsbomb', source_id:String(m.match_id), league_id:leagueRow.id, season_id:seasonRow.id, home_team_id:null, away_team_id:null, kickoff_at:m.match_date ? new Date(m.match_date+'T'+(m.kick_off||'00:00:00')+'Z').toISOString() : null, status:m.match_status, home_score:m.home_score, away_score:m.away_score, stage:m.competition_stage?.name, round:m.match_week ? `Matchweek ${m.match_week}` : null, venue:m.stadium?.name, referee:m.referee?.name, raw:m });
  }
  await upsert('teams', [...teams.values()]);
  const { data: teamRows, error: teamError } = await sb.from('teams').select('id,source_id').eq('source','statsbomb');
  if (teamError) throw teamError;
  const teamId = new Map(teamRows.map(t => [t.source_id, t.id]));
  for (const r of matchRows) { r.home_team_id = teamId.get(String(r.raw.home_team.team_id)); r.away_team_id = teamId.get(String(r.raw.away_team.team_id)); }
  await upsert('matches', matchRows);
  const { data: matchRowsDb, error: matchError } = await sb.from('matches').select('id,source_id,raw').eq('source','statsbomb');
  if (matchError) throw matchError;
  const matchId = new Map(matchRowsDb.map(m => [m.source_id, m.id]));
  for (const m of matches) {
    const mid = matchId.get(String(m.match_id));
    if (!mid) continue;
    const lineupRows = [];
    for (const side of m.lineups ?? []) {
      for (const p of side.lineup ?? []) {
        players.set(String(p.player_id), { source:'statsbomb', source_id:String(p.player_id), full_name:p.player_name, known_name:p.player_nickname || p.player_name, position:p.position?.name ?? null });
        lineupRows.push({ match_id:mid, team_id:teamId.get(String(side.team_id)), player_id:null, is_starter:p.starting_lineup ?? false, position:p.position?.name ?? null, shirt_number:p.jersey_number ?? null, raw:p });
      }
    }
    await upsert('players', [...players.values()]);
    const { data: playerRows, error: playerError } = await sb.from('players').select('id,source_id').eq('source','statsbomb');
    if (playerError) throw playerError;
    const playerId = new Map(playerRows.map(p => [p.source_id, p.id]));
    for (const l of lineupRows) l.player_id = playerId.get(String(l.raw.player_id));
    if (lineupRows.length) {
      const { error } = await sb.from('match_lineups').upsert(lineupRows, { onConflict: 'match_id,player_id' });
      if (error) console.warn('lineups', error.message);
    }
  }
  console.log(`Imported ${matches.length} matches for ${c.competition_name} ${c.season_name}`);
}
