-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run).
-- Stores each story as flexible JSON in `data`, with a few real columns pulled
-- out for fast filtering/RLS. No auth system yet, so writes are intentionally
-- permissive — matches the site's current "admin has no login yet" reality.

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

-- No admin login exists yet (documented Phase 3 item). The admin dashboard
-- needs to read every row (including pending/hidden) and needs to write
-- approve/feature/hide/delete actions, and there's no auth layer to gate
-- that on — so reads and updates are open for now. This is an accepted,
-- documented gap (matches "Admin auth: /#/admin is currently open (demo)"
-- already called out in README.md), not an oversight. Tighten this once
-- real admin auth ships.
create policy "Open read (no admin auth yet)"
  on stories for select
  using (true);

create policy "Open update (no admin auth yet)"
  on stories for update
  using (true);

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
