-- ============================================================
-- Playbook V1 — Supabase Schema
-- Run this entire file in your Supabase SQL editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── STUDIES ──────────────────────────────────────────────────
create table if not exists public.studies (
  id            uuid primary key default uuid_generate_v4(),
  user_id       text not null,           -- Clerk user ID (e.g. "user_abc123")
  title         text not null default 'Untitled Study',
  type          text not null default 'analysis'
                  check (type in ('matchup', 'stats', 'analysis')),
  sport         text not null default 'NFL',
  body          text not null default '',
  confidence    integer not null default 50
                  check (confidence >= 0 and confidence <= 100),
  spread        text,
  total         text,
  tags          text[] not null default '{}',
  pinned        boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger studies_updated_at
  before update on public.studies
  for each row execute function update_updated_at();

-- Indexes for common queries
create index if not exists studies_user_id_idx    on public.studies (user_id);
create index if not exists studies_updated_at_idx on public.studies (updated_at desc);
create index if not exists studies_type_idx       on public.studies (type);

-- ── PREDICTIONS ───────────────────────────────────────────────
create table if not exists public.predictions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             text not null,
  game                text not null,
  sport               text not null,
  date                date not null,
  type                text not null
                        check (type in ('spread', 'total', 'ml')),
  pick                text not null,
  confidence          integer not null
                        check (confidence >= 1 and confidence <= 10),
  outcome             text not null default 'pending'
                        check (outcome in ('win', 'loss', 'push', 'pending')),
  linked_study_id     uuid references public.studies(id) on delete set null,
  linked_study_title  text,
  notes               text,
  created_at          timestamptz not null default now()
);

create index if not exists predictions_user_id_idx   on public.predictions (user_id);
create index if not exists predictions_created_at_idx on public.predictions (created_at desc);
create index if not exists predictions_outcome_idx   on public.predictions (outcome);

-- ── ROW LEVEL SECURITY (RLS) ──────────────────────────────────
-- Users can only read/write their own rows.
-- We use Clerk user IDs stored in the user_id column.
-- The Clerk JWT is verified via Supabase's JWT secret.

alter table public.studies    enable row level security;
alter table public.predictions enable row level security;

-- Studies policies
create policy "Users can view own studies"
  on public.studies for select
  using (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "Users can insert own studies"
  on public.studies for insert
  with check (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "Users can update own studies"
  on public.studies for update
  using (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "Users can delete own studies"
  on public.studies for delete
  using (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Predictions policies
create policy "Users can view own predictions"
  on public.predictions for select
  using (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "Users can insert own predictions"
  on public.predictions for insert
  with check (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "Users can update own predictions"
  on public.predictions for update
  using (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "Users can delete own predictions"
  on public.predictions for delete
  using (user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- ── DONE ──────────────────────────────────────────────────────
-- Verify with: select * from public.studies limit 5;
