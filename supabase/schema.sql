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

-- Anyone can submit a story, but it always lands as pending — a submitter
-- can't mark their own story pre-approved.
create policy "Anyone can submit a pending story"
  on stories for insert
  with check (status = 'pending');

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
