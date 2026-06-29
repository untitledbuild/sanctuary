-- =============================================================================
-- untitled build — contact form storage (Supabase)
-- -----------------------------------------------------------------------------
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
--
-- Security model: the website is a static site that writes submissions directly
-- from the browser with the PUBLIC anon key. That is safe ONLY because of the
-- Row-Level-Security policy below, which lets the `anon` role INSERT a row but
-- never SELECT / UPDATE / DELETE. So the public key can drop a message in the
-- box but cannot read anyone's submissions. You read them in the Dashboard
-- (Table editor) or with the service-role key from a trusted environment.
-- =============================================================================

create table if not exists public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  email         text not null,
  project_type  text,
  message       text,
  -- light spam/abuse context (filled server-side by Supabase, not the client)
  user_agent    text
);

-- Enable RLS — with no policy, every role (including anon) is denied by default.
alter table public.contact_submissions enable row level security;

-- The ONLY thing the public anon key may do: insert a new submission.
-- with check (true) accepts any insert; tighten with constraints if desired
-- (e.g. char_length(message) < 5000).
drop policy if exists "anon can insert submissions" on public.contact_submissions;
create policy "anon can insert submissions"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- (No SELECT/UPDATE/DELETE policy for anon ⇒ reads/edits/deletes are denied.)

-- Optional: capture the request user-agent automatically so the client never
-- has to send it. Comment out if you don't want it.
create or replace function public.set_submission_meta()
returns trigger
language plpgsql
security definer
as $$
begin
  new.user_agent := current_setting('request.headers', true)::json ->> 'user-agent';
  return new;
end;
$$;

drop trigger if exists trg_submission_meta on public.contact_submissions;
create trigger trg_submission_meta
  before insert on public.contact_submissions
  for each row execute function public.set_submission_meta();
