Status: ready-for-human

# Per-habit descriptions (Atomic Habits fields) + accordion UI

## Description

New `habit_descriptions` Supabase table (ADR-0016) holding named free-text fields per habit
(Триггер, 2 минуты, Я буду..., Идентичность, Если делаю, Если не делаю — see `CONTEXT.md`),
read-only in the app (edited directly via Supabase).

## Acceptance criteria

- [x] `habit_descriptions` table + index + RLS policy in `supabase/schema.sql`
- [x] `Habit.description: HabitDescriptionField[]` type; `supabaseDataStore.loadHabits` fetches and
      sorts it
- [x] `extract_seed_data.py`/`migrate-habits-data.mjs` extended to backfill descriptions
- [x] `DayGrid` restructured to per-habit accordion blocks (desktop + mobile); the whole
      `HabitNameCell` row is the expand/collapse trigger
- [x] A habit with no description fields still shows the toggle, with an empty-state message
- [x] Existing tests (`streak.test.ts`, `dayGrid.test.ts`, etc.) still pass
- [ ] Verified in the running app: expand/collapse on both a full-description and an
      empty-description habit, on mobile and desktop widths

## Comments

Reviewed via `/code-review` (Standards + Spec), clean after two small fixes. Not exercised against
the live authenticated app (no test credentials in that environment) — user asked to spot-check
directly.
