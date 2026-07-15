-- ============================================================
-- BB Analytics — event store
-- Run ONCE in the Supabase SQL editor (project xtpbpznvvgthhelslrqn,
-- the same BB Code Remote project as bb_leads / training log).
-- Feeds /api/track and the /analytics dashboard in bb-platform.
-- ============================================================

create table if not exists public.bb_events (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  event text not null,
  page text default '',
  session_id text default '',
  visitor_id text default '',
  product text default '',
  price numeric,
  revenue numeric,
  button_text text default '',
  destination text default '',
  video_id text default '',
  utm_source text default '',
  utm_medium text default '',
  utm_campaign text default '',
  utm_content text default '',
  traffic_source text default '',
  referrer text default '',
  landing_page text default '',
  user_agent text default ''
);

create index if not exists bb_events_event_idx on public.bb_events (event);
create index if not exists bb_events_created_idx on public.bb_events (created_at);
create index if not exists bb_events_session_idx on public.bb_events (session_id);

-- RLS: same open-policy pattern as the other bb_ tables. The anon key can
-- insert (event ingestion) and select (dashboard reads server-side).
alter table public.bb_events enable row level security;
drop policy if exists bb_events_all on public.bb_events;
create policy bb_events_all on public.bb_events for all using (true) with check (true);
