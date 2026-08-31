---
status: accepted
---

# Habit descriptions live in a free-text key/value table, not fixed columns

Each habit's Atomic Habits description (trigger, 2-minute version, "I will..." statement, identity, benefit, cost) is stored as rows in a new `habit_descriptions` table (`habit_id`, `title`, `text`, `order`) — one row per field — rather than as 6 named columns on `habits` or on a 1:1 child table. `title` is unconstrained free text (no `CHECK`, unlike `habits.priority`) so a field can be added, renamed, or removed later with a plain `INSERT`/`UPDATE`/`DELETE`, no schema migration. Display order is an explicit `order` integer rather than insertion time, so reordering doesn't depend on rewriting rows. Mirrors `quick_answers`' shape (ADR-0011) for the same reason: rows are easier to edit one at a time via the Supabase Table Editor than a wide row or a JSONB blob.

## Schema

```sql
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
```

## Considered Options

- Flat columns on `habits` (`cue`, `two_minute_version`, ...): rejected — adding a 7th field means an `ALTER TABLE`, and most habits leave most fields blank (7 of 15 currently have zero filled), so a wide sparse row wastes the table-editor view.
- A 1:1 child table with 6 named columns: rejected for the same extensibility reason.
- A `CHECK (title in (...))` enum on `title`, matching `habits.priority`: rejected — the explicit goal is adding/removing fields without touching schema or code.
