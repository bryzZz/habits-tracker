# Per-habit description (Atomic Habits fields)

Resolved via a `/grill-with-docs` session on 2026-08-31. See
[CONTEXT.md](../../CONTEXT.md)'s "Описание привычки" term and
[ADR-0016](../../docs/adr/0016-habit-descriptions-free-text-key-value-table.md).

## Context

`data/data.xlsx`'s "Описание" sheet has, per habit, up to 6 Atomic Habits fields (trigger,
2-minute version, "I will..." statement, identity, benefit-if-followed, cost-if-not-followed).
`CONTEXT.md`'s Habit term already namedropped this but it was never implemented — the Supabase
migration ticket (`.scratch/supabase-data-migration/`) explicitly scoped it out. This ticket adds
it, display-only, to `WeekPage`.

## Decisions

1. **Storage**: a new `habit_descriptions` table — `id, habit_id, title, text, "order"` — one row
   per field, mirroring `quick_answers`' shape (ADR-0011) rather than fixed columns on `habits`.
   `title` is free text (no `CHECK` enum, unlike `habits.priority`) so a field can be added,
   renamed, or removed later without a schema change. `"order"` is an explicit integer driving
   display order (not insertion time). RLS mirrors `quick_answers`: joins back to `habits` for
   ownership, no `user_id` of its own. Full SQL in ADR-0016.
2. **Fields are independently optional per habit.** Real data: 8/15 habits have all 6 fields
   filled, 3/15 have 1-2, 4/15 have none. Skip empty cells entirely on import — don't write empty
   rows.
3. **`title` holds the short display label directly** (`Триггер`, `2 минуты`, `Я буду...`,
   `Идентичность`, `Если делаю`, `Если не делаю`) — the UI renders `{title}: {text}` per card with
   no separate lookup/mapping table. These are a translation of the xlsx's long column headers
   (which are themselves questions the cell value answers), not a literal copy of them.
4. **Read-only for now.** No in-app edit form — matches how habit name/priority/quick-answers are
   also only ever edited via Supabase directly, not the app UI.
5. **Backfill via the existing scripts, extended** — not a new one-off script:
   - `scripts/extract_seed_data.py` gains a step reading the "Описание" sheet (columns B-G, in
     that fixed order) into each habit's new `description: [{title, text}, ...]` array in
     `data/habits-data.json`, skipping blank cells.
   - `scripts/migrate-habits-data.mjs` gains a `replaceDescriptions` step (delete-then-reinsert
     per habit into `habit_descriptions`, `order` = array index) mirroring `replaceQuickAnswers`,
     run the same way the original migration was (service-role key, against production, by the
     user).
6. **Every habit shows the expand toggle**, even with zero description rows — no hiding it for
   habits with nothing filled. Expanding a habit with zero rows shows an empty-state message
   instead of an empty grid.
7. **Toggle is per-habit and independent** — any number of habits can have their description
   expanded simultaneously; opening one never closes another. The entire `HabitNameCell` row is
   the toggle (an invisible full-row `AccordionPrimitive.Trigger`, stretched-link style) — not a
   small icon-only button — since a dedicated toggle button alone was too small a target, and even
   a name-block-only trigger still left too small a target. No chevron or other visual toggle
   indicator; the existing hide (`EyeOff`) button stays a normal button at the far right, layered
   above the invisible trigger so it keeps its own separate click behavior.
8. **Desktop `DayGrid` restructures from two parallel scrolling columns (all names stacked | all
   day-cells stacked) into per-habit blocks.** Each block's top part keeps today's side-by-side
   look (name-rail left, day-cells right) — only the "two independent columns" plumbing goes away,
   not the visual arrangement. The description panel, when open, spans the full block width below
   that row and pushes the next habit's block down. Mobile's existing stacked block (name above
   cells) gets the same description panel appended below its cells row.
9. **Description fields render as a reflowing card grid** — CSS grid `auto-fit`/`minmax` so cards
   stretch to fill available width and wrap to fewer/one column when narrow. One card per field
   that has data (no blank cards for missing fields), each showing its short title as a header and
   the field's text as the body.

## Out of scope

- In-app editing of description fields.
- Changing `HiddenHabitsAccordion` (hidden habits still just list name + "Show" button).
- `DayGridSkeleton`'s loading placeholder shape (unchanged — it's a generic placeholder, not real
  accordion content).
