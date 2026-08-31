Status: done

# Habit description data layer

See `../spec.md` for full context.

## Description

New `habit_descriptions` Supabase table (ADR-0016), `Habit`/`HabitDescriptionField` types, and
`supabaseDataStore.loadHabits` extended to fetch and sort it. Backfill via extending
`scripts/extract_seed_data.py` and `scripts/migrate-habits-data.mjs`, not a new script.

## Acceptance criteria

- [x] `supabase/schema.sql` gains the `habit_descriptions` table + index + RLS policy (SQL in
      ADR-0016) — appended to the file, not applied to production by the agent (matches how
      `schema.sql` was originally written: applied later by the user via the SQL editor).
- [x] `src/data/types.ts`: new `HabitDescriptionField { title: string; text: string }`; `Habit`
      gains `description: HabitDescriptionField[]` (always an array, never `undefined`).
- [x] `src/data/supabaseDataStore.ts`: `loadHabits` fetches `habit_descriptions` and maps it into
      `description`, sorted ascending by the DB row's `order` column (that column itself doesn't
      leak into the `Habit` type — array order carries it from here on).
- [x] `scripts/extract_seed_data.py`: new step parsing the "Описание" sheet (columns B-G, fixed
      order) per habit via the existing `HABIT_IDS` name map, skipping blank cells, writing
      `description: [{title, text}, ...]` per habit into `data/habits-data.json` in column order.
      Each xlsx column header maps to a short display label used as `title`:

  | Column | xlsx header                                      | `title`       |
  | ------ | ------------------------------------------------ | ------------- |
  | B      | Триггер (Cue)                                    | Триггер       |
  | C      | 2-минутная версия                                | 2 минуты      |
  | D      | Я буду...                                        | Я буду...     |
  | E      | Идентичность (Identity)                          | Идентичность  |
  | F      | Что будет если я буду следовать этой привычке    | Если делаю    |
  | G      | Что будет если я НЕ буду следовать этой привычке | Если не делаю |

- [x] `scripts/migrate-habits-data.mjs`: new `replaceDescriptions(habitDbId, description)` step
      (delete-then-reinsert into `habit_descriptions`, `order` = array index), called alongside
      `replaceQuickAnswers` in the per-habit migration loop.
- [x] `data/habits-data.json` regenerated via the updated `extract_seed_data.py` (real personal
      data, gitignored — just confirm the script runs clean and the new field is present).
- [x] Existing tests (`streak.test.ts`, `dayGrid.test.ts`, etc.) still pass — no behavior change to
      anything they cover.

## Comments

Implemented via `/implement`, reviewed via `/code-review` (Standards + Spec, both clean after
fixing the one hard Standards hit: a 4-line JSDoc comment on `HabitRow` over the 2-line cap, and
one Spec gap: ADR-0016 was cited as containing the full SQL but only had prose — the SQL block was
added). `pnpm run test`/`lint`/`build` all pass clean. `scripts/extract_seed_data.py` and
`scripts/migrate-habits-data.mjs` are both gitignored in this repo (see `.gitignore`) — their
edits exist on disk but were never meant to be committed, matching how `create-account.mjs` and
the original `migrate-habits-data.mjs` are handled. The regenerated `data/habits-data.json` has
8/15 habits with a full 6-field description, 3/15 partial, 4/15 empty — matches the real xlsx
data. `migrate-habits-data.mjs`'s new `replaceDescriptions` step has not been run against
production — that's the user's call, same as the original migration.
