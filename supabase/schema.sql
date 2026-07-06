-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run).
-- Stores each story as flexible JSON in `data`, with a few real columns pulled
-- out for fast filtering/RLS.

-- Real admin auth: reuses the site's existing X OAuth login (same session
-- used everywhere else on the site) instead of a separate password system.
-- Supabase attaches the signed-in user's X profile as `user_metadata` on
-- their JWT, so this checks that directly — enforced by the database, not
-- just hidden by the page. Update this handle if the owner's X account ever
-- changes.
create or replace function is_site_owner()
returns boolean
language sql
stable
as $$
  select coalesce(
    lower(auth.jwt() -> 'user_metadata' ->> 'user_name') = 'chesus'
    or lower(auth.jwt() -> 'user_metadata' ->> 'preferred_username') = 'chesus',
    false
  );
$$;

create table if not exists stories (
  id text primary key,
  status text not null default 'pending',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  data jsonb not null
);

alter table stories enable row level security;

-- Stories auto-publish on submit (no admin approval step) — matches the
-- "no admin auth yet" reality of the other policies below. Bad/scam entries
-- are handled after the fact via the Admin dashboard's Hide action.
create policy "Anyone can submit a story"
  on stories for insert
  with check (true);

-- Reads stay open: the public Browse/Home pages and the Admin dashboard
-- both read this same table (admin needs to see pending/hidden rows too),
-- and there's no separate "public" view to split them across.
create policy "Open read"
  on stories for select
  using (true);

-- Admin actions (approve/feature/hide/mark supported) now require being
-- signed in as the site owner's actual X account — reuses the same X OAuth
-- session already used for story verification, so no separate login system
-- was needed. is_site_owner() is defined further down.
create policy "Only the site owner can update stories"
  on stories for update
  using (is_site_owner());

-- Public giving ledger: a recipient pastes a tx signature after receiving
-- support, the app verifies on-chain that it really paid their wallet (see
-- verifyReceivedOnChain in src/utils.js), then this row records the proof.
-- Anyone can read it (it's just public chain data anyway); insert requires a
-- signature-shaped string, but the real fraud-proofing happens client-side
-- against Solana RPC before the insert — same accepted-gap pattern as the
-- rest of this schema (no serverless backend to verify server-side yet).
create extension if not exists pgcrypto;

create table if not exists story_confirmations (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references stories(id) on delete cascade,
  tx_signature text not null unique,
  amount numeric not null,
  token text not null default 'SOL',
  confirmed_at timestamptz not null default now()
);

alter table story_confirmations enable row level security;

create policy "Anyone can read confirmations"
  on story_confirmations for select
  using (true);

create policy "Anyone can insert a verified confirmation"
  on story_confirmations for insert
  with check (length(tx_signature) >= 64 and amount > 0);

-- Supporters — same jsonb-blob pattern as stories, so a "Become a Supporter"
-- submission is actually visible to every visitor instead of only living in
-- the submitter's own browser tab.
create table if not exists supporters (
  id text primary key,
  created_at timestamptz not null default now(),
  data jsonb not null
);

alter table supporters enable row level security;

create policy "Anyone can become a supporter"
  on supporters for insert
  with check (true);

create policy "Open read (no admin auth yet)"
  on supporters for select
  using (true);

-- Community tools directory — hand-curated from the Admin dashboard (e.g.
-- tools Ansem shares, community-built analytics sites), not user-submitted.
create table if not exists community_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  description text,
  shared_by text,
  created_at timestamptz not null default now()
);

alter table community_tools enable row level security;

create policy "Open read"
  on community_tools for select
  using (true);

create policy "Only the site owner can add tools"
  on community_tools for insert
  with check (is_site_owner());

create policy "Only the site owner can remove tools"
  on community_tools for delete
  using (is_site_owner());
