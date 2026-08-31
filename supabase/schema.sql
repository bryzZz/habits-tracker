-- Habits-data migration schema (ADR-0010, ADR-0011, ADR-0012).
-- Run once via the Supabase SQL editor against the project already used for
-- auth (see scripts/create-account.mjs) — no Supabase CLI migrations
-- adopted, per the grilling session behind this ticket.

-- habits ----------------------------------------------------------------
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  name text not null,
  priority text not null check (priority in ('priority', 'active', 'paused')),
  visible boolean not null default true
);

create index habits_user_id_idx on public.habits(user_id);

alter table public.habits enable row level security;

create policy "habits_all_own" on public.habits
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- quick_answers -----------------------------------------------------------
-- No user_id of its own (QuickAnswer never carried one) — ownership is via
-- the parent habit, so RLS here joins back to habits.
create table public.quick_answers (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  text text not null,
  score numeric not null check (score >= 0 and score <= 1)
);

create index quick_answers_habit_id_idx on public.quick_answers(habit_id);

alter table public.quick_answers enable row level security;

create policy "quick_answers_all_own" on public.quick_answers
  for all using (
    exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
  );

-- habit_descriptions -------------------------------------------------------
-- One row per Atomic Habits field (ADR-0016) — free-text `title`, no enum
-- `CHECK`, so a field can be added/renamed/removed with a plain row change,
-- no schema migration. Same ownership-via-parent-habit RLS as quick_answers.
create table public.habit_descriptions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  title text not null,
  text text not null,
  "order" integer not null
);

create index habit_descriptions_habit_id_idx on public.habit_descriptions(habit_id);

alter table public.habit_descriptions enable row level security;

create policy "habit_descriptions_all_own" on public.habit_descriptions
  for all using (
    exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
  );

-- entries -----------------------------------------------------------------
create table public.entries (
  user_id uuid not null default auth.uid() references auth.users(id),
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null,
  score numeric not null check (score >= 0 and score <= 1),
  note text not null default '',
  primary key (user_id, habit_id, date)
);

create index entries_habit_date_idx on public.entries(habit_id, date);

alter table public.entries enable row level security;

create policy "entries_all_own" on public.entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- get_habit_streaks --------------------------------------------------------
-- Ports calculateStreak/calculateBestStreak from src/lib/streak.ts exactly
-- (today only anchors the current-streak walk if it already has a row; a
-- missing day breaks a streak the same as score = 0; best streak walks every
-- calendar day between a habit's first and last entry). Takes `p_today` as a
-- parameter — deliberately not `current_date` — so the client's own local
-- "today" (dayjs(), matching the rest of the app) decides the boundary
-- instead of the database server's timezone.
--
-- NOTE: written as a direct line-by-line transliteration of streak.ts and
-- checked by hand against every case in streak.test.ts, but NOT executed
-- against a live Postgres (no local Supabase/psql available in the
-- implementing environment) — run streak.test.ts's cases against this
-- function for real once it's applied, before trusting it in production.
create or replace function public.get_habit_streaks(p_habit_id uuid, p_today date)
returns table (current_streak integer, best_streak integer)
language plpgsql
stable
security invoker
as $$
declare
  v_first_date date;
  v_last_date date;
  v_cursor date;
  v_score numeric;
  v_current integer := 0;
  v_best integer := 0;
  v_run integer := 0;
  v_offset integer;
begin
  select min(date), max(date)
    into v_first_date, v_last_date
    from public.entries
    where habit_id = p_habit_id and user_id = auth.uid();

  if v_first_date is null then
    return query select 0, 0;
    return;
  end if;

  -- Best streak: walk every calendar day between the habit's first and last
  -- entry, exactly like calculateBestStreak.
  for v_offset in 0..(v_last_date - v_first_date) loop
    v_cursor := v_first_date + v_offset;

    select score into v_score
      from public.entries
      where habit_id = p_habit_id and user_id = auth.uid() and date = v_cursor;

    if coalesce(v_score, 0) > 0 then
      v_run := v_run + 1;
      v_best := greatest(v_best, v_run);
    else
      v_run := 0;
    end if;
  end loop;

  -- Current streak: walk backward from p_today, exactly like calculateStreak.
  if exists (
    select 1 from public.entries
    where habit_id = p_habit_id and user_id = auth.uid() and date = p_today
  ) then
    v_cursor := p_today;
  else
    v_cursor := p_today - 1;
  end if;

  loop
    select score into v_score
      from public.entries
      where habit_id = p_habit_id and user_id = auth.uid() and date = v_cursor;

    exit when coalesce(v_score, 0) <= 0;

    v_current := v_current + 1;
    v_cursor := v_cursor - 1;
  end loop;

  return query select v_current, v_best;
end;
$$;
