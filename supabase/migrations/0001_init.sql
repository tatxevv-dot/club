-- FootballStats: comprehensive football data schema
create extension if not exists "uuid-ossp";

create table if not exists leagues (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  source_id text not null,
  name text not null,
  country text,
  type text,
  logo_url text,
  created_at timestamptz default now(),
  unique(source, source_id)
);

create table if not exists seasons (
  id uuid primary key default uuid_generate_v4(),
  league_id uuid references leagues(id) on delete cascade,
  source text not null,
  source_id text not null,
  name text,
  start_date date,
  end_date date,
  is_current boolean default false,
  created_at timestamptz default now(),
  unique(source, source_id)
);

create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  source_id text not null,
  name text not null,
  short_name text,
  country text,
  logo_url text,
  founded integer,
  created_at timestamptz default now(),
  unique(source, source_id)
);

create table if not exists players (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  source_id text not null,
  full_name text not null,
  known_name text,
  position text,
  detailed_position text,
  birth_date date,
  nationality text,
  height_cm integer,
  preferred_foot text,
  photo_url text,
  created_at timestamptz default now(),
  unique(source, source_id)
);

create table if not exists player_teams (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references players(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  shirt_number integer,
  position text,
  is_loan boolean default false,
  joined_at date,
  unique(player_id, team_id, season_id)
);

create table if not exists matches (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  source_id text not null,
  league_id uuid references leagues(id),
  season_id uuid references seasons(id),
  home_team_id uuid references teams(id),
  away_team_id uuid references teams(id),
  kickoff_at timestamptz,
  status text default 'SCHEDULED',
  minute integer,
  home_score integer,
  away_score integer,
  home_xg numeric,
  away_xg numeric,
  stage text,
  round text,
  venue text,
  referee text,
  attendance integer,
  raw jsonb,
  created_at timestamptz default now(),
  unique(source, source_id)
);
create index if not exists matches_kickoff_idx on matches(kickoff_at desc);
create index if not exists matches_league_idx on matches(league_id, kickoff_at desc);

create table if not exists match_events (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  source text not null,
  source_event_id text,
  minute integer,
  second integer,
  period text,
  event_type text not null,
  team_id uuid references teams(id),
  player_id uuid references players(id),
  related_player_id uuid references players(id),
  outcome text,
  start_x numeric,
  start_y numeric,
  end_x numeric,
  end_y numeric,
  detail text,
  raw jsonb,
  created_at timestamptz default now(),
  unique(source, source_event_id)
);
create index if not exists match_events_match_idx on match_events(match_id, minute);

create table if not exists match_lineups (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id),
  player_id uuid references players(id),
  is_starter boolean,
  position text,
  shirt_number integer,
  minutes_played integer,
  raw jsonb,
  unique(match_id, player_id)
);

create table if not exists player_match_stats (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  team_id uuid references teams(id),
  source text not null,
  rating numeric,
  minutes integer,
  starts boolean,
  goals integer,
  assists integer,
  shots integer,
  shots_on_target integer,
  xg numeric,
  xa numeric,
  xgchain numeric,
  xgbuildup numeric,
  touches integer,
  passes integer,
  passes_completed integer,
  pass_accuracy numeric,
  key_passes integer,
  progressive_passes integer,
  passes_into_final_third integer,
  passes_into_penalty_area integer,
  crosses integer,
  through_balls integer,
  dribbles_attempted integer,
  dribbles_completed integer,
  carries integer,
  progressive_carries integer,
  carries_into_final_third integer,
  carries_into_penalty_area integer,
  tackles integer,
  tackles_won integer,
  interceptions integer,
  blocks integer,
  clearances integer,
  recoveries integer,
  pressures integer,
  successful_pressures integer,
  aerial_duels_won integer,
  aerial_duels_lost integer,
  ground_duels_won integer,
  ground_duels_lost integer,
  fouls_committed integer,
  fouls_drawn integer,
  offsides integer,
  yellow_cards integer,
  red_cards integer,
  saves integer,
  goals_conceded integer,
  clean_sheet boolean,
  raw jsonb,
  created_at timestamptz default now(),
  unique(match_id, player_id, source)
);
create index if not exists player_match_stats_player_idx on player_match_stats(player_id, match_id desc);

create table if not exists player_season_stats (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references players(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  league_id uuid references leagues(id),
  team_id uuid references teams(id),
  source text not null,
  appearances integer,
  starts integer,
  minutes integer,
  goals integer,
  assists integer,
  rating numeric,
  xg numeric,
  xa numeric,
  xgchain numeric,
  xgbuildup numeric,
  shots integer,
  shots_on_target integer,
  key_passes integer,
  progressive_passes integer,
  passes integer,
  pass_accuracy numeric,
  tackles integer,
  interceptions integer,
  pressures integer,
  successful_pressures integer,
  recoveries integer,
  aerial_duels_won integer,
  aerial_duels_won_pct numeric,
  dribbles_attempted integer,
  dribbles_completed integer,
  progressive_carries integer,
  touches integer,
  yellow_cards integer,
  red_cards integer,
  clean_sheets integer,
  raw jsonb,
  created_at timestamptz default now(),
  unique(player_id, season_id, league_id, team_id, source)
);

create table if not exists team_match_stats (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  source text not null,
  possession numeric,
  shots integer,
  shots_on_target integer,
  shots_from_open_play integer,
  shots_from_set_piece integer,
  xg numeric,
  xgot numeric,
  big_chances integer,
  big_chances_created integer,
  touches_in_opposition_box integer,
  passes integer,
  passes_completed integer,
  pass_accuracy numeric,
  progressive_passes integer,
  crosses integer,
  corners integer,
  tackles integer,
  interceptions integer,
  clearances integer,
  recoveries integer,
  pressures integer,
  successful_pressures integer,
  ppda numeric,
  fouls integer,
  yellow_cards integer,
  red_cards integer,
  saves integer,
  goals_conceded integer,
  raw jsonb,
  created_at timestamptz default now(),
  unique(match_id, team_id, source)
);

create table if not exists team_season_stats (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references teams(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  league_id uuid references leagues(id),
  source text not null,
  position integer,
  matches integer,
  wins integer,
  draws integer,
  losses integer,
  goals_for integer,
  goals_against integer,
  goal_difference integer,
  points integer,
  xg_for numeric,
  xg_against numeric,
  xg_difference numeric,
  possession numeric,
  shots integer,
  shots_on_target integer,
  passes integer,
  pass_accuracy numeric,
  progressive_passes integer,
  tackles integer,
  interceptions integer,
  clearances integer,
  recoveries integer,
  pressures integer,
  successful_pressures integer,
  ppda numeric,
  clean_sheets integer,
  raw jsonb,
  created_at timestamptz default now(),
  unique(team_id, season_id, league_id, source)
);

create table if not exists shot_events (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  event_id uuid references match_events(id) on delete cascade,
  player_id uuid references players(id),
  team_id uuid references teams(id),
  minute integer,
  x numeric,
  y numeric,
  xg numeric,
  xgot numeric,
  outcome text,
  body_part text,
  technique text,
  is_penalty boolean,
  is_own_goal boolean,
  assist_player_id uuid references players(id),
  freeze_frame jsonb,
  raw jsonb,
  created_at timestamptz default now()
);

create table if not exists pass_events (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  event_id uuid references match_events(id) on delete cascade,
  player_id uuid references players(id),
  recipient_player_id uuid references players(id),
  team_id uuid references teams(id),
  minute integer,
  start_x numeric,
  start_y numeric,
  end_x numeric,
  end_y numeric,
  length numeric,
  angle numeric,
  is_progressive boolean,
  is_key_pass boolean,
  is_cross boolean,
  is_through_ball boolean,
  is_switch boolean,
  under_pressure boolean,
  outcome text,
  raw jsonb,
  created_at timestamptz default now()
);

create table if not exists defensive_events (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  event_id uuid references match_events(id) on delete cascade,
  player_id uuid references players(id),
  team_id uuid references teams(id),
  minute integer,
  event_type text,
  x numeric,
  y numeric,
  outcome text,
  raw jsonb,
  created_at timestamptz default now()
);

create table if not exists tracking_frames (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  event_id uuid references match_events(id) on delete cascade,
  frame_index integer,
  visible_players jsonb,
  raw jsonb,
  created_at timestamptz default now(),
  unique(match_id, event_id, frame_index)
);

create table if not exists sync_jobs (
  id uuid primary key default uuid_generate_v4(),
  provider text not null,
  entity text not null,
  status text default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  error text,
  meta jsonb,
  created_at timestamptz default now()
);

create or replace view v_recent_matches as
select m.*, l.name as league_name, ht.name as home_team, at2.name as away_team
from matches m
left join leagues l on l.id=m.league_id
left join teams ht on ht.id=m.home_team_id
left join teams at2 on at2.id=m.away_team_id
order by m.kickoff_at desc nulls last;

alter table leagues enable row level security;
alter table seasons enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table player_teams enable row level security;
alter table matches enable row level security;
alter table match_events enable row level security;
alter table match_lineups enable row level security;
alter table player_match_stats enable row level security;
alter table player_season_stats enable row level security;
alter table team_match_stats enable row level security;
alter table team_season_stats enable row level security;
alter table shot_events enable row level security;
alter table pass_events enable row level security;
alter table defensive_events enable row level security;
alter table tracking_frames enable row level security;
alter table sync_jobs enable row level security;

create policy "public read football data" on leagues for select using (true);
create policy "public read football data" on seasons for select using (true);
create policy "public read football data" on teams for select using (true);
create policy "public read football data" on players for select using (true);
create policy "public read football data" on player_teams for select using (true);
create policy "public read football data" on matches for select using (true);
create policy "public read football data" on match_events for select using (true);
create policy "public read football data" on match_lineups for select using (true);
create policy "public read football data" on player_match_stats for select using (true);
create policy "public read football data" on player_season_stats for select using (true);
create policy "public read football data" on team_match_stats for select using (true);
create policy "public read football data" on team_season_stats for select using (true);
create policy "public read football data" on shot_events for select using (true);
create policy "public read football data" on pass_events for select using (true);
create policy "public read football data" on defensive_events for select using (true);
create policy "public read football data" on tracking_frames for select using (true);
create policy "public read football data" on sync_jobs for select using (true);
