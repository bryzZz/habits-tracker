Status: ready-for-human

# Habit description accordion (WeekPage)

Blocked by: 01

See `../spec.md` for full context.

## Description

Per-habit expand/collapse of the new description data in `WeekPage`'s `DayGrid`, plus the desktop
restructuring from two parallel columns to per-habit blocks that the expand/collapse requires.

## Acceptance criteria

- [x] The entire `HabitNameCell` row is the description toggle (an invisible full-row
      `AccordionPrimitive.Trigger`, stretched-link style) — not a small icon-only button, so the
      click target is as large as possible. No chevron or other visual indicator. The hide
      (`EyeOff`) button stays a normal button at the far right, layered above the invisible
      trigger so it keeps its own separate click behavior; same hover-reveal-on-desktop /
      always-visible-on-mobile treatment as before. Shown for every habit regardless of whether it
      has any description rows.
- [x] `DayGrid` desktop layout is per-habit blocks (name-rail left / day-cells right, same visual
      arrangement as today) instead of two independently-stacked columns; mobile keeps its
      existing stacked block. Both wrap each habit in an accordion item so any number of habits
      can have their description open simultaneously, independent of each other.
- [x] Expanding a habit reveals a card grid below its row (full block width on desktop): one card
      per description field with data, short title as header + field text as body, CSS grid
      `auto-fit`/`minmax` so cards reflow (stretch to fill width, wrap to fewer/one column when
      narrow).
- [x] A habit with zero description rows still shows the toggle; expanding it shows an empty-state
      message instead of an empty grid.
- [x] `DayGridHeader` (the date row) and the page-swipe transition behavior are unchanged — dates
      still line up above the day-cells column, and only the cells (not the name rail) animate on
      page navigation, same as before this ticket.
- [x] `HiddenHabitsAccordion` is untouched.
- [ ] Verified in the running app (not just typecheck/build): expand/collapse on both a
      full-description and an empty-description habit, on both mobile and desktop widths.

## Comments

Implemented via `/implement`, reviewed via `/code-review` (Standards + Spec, both clean after two
fixes — see ticket 01's Comments). `pnpm run test`/`lint`/`build` all pass clean and `tsc -b` is
clean. The last checkbox is intentionally left unchecked: this app requires a real Supabase login
(single pre-created account, ADR-0008) and no test credentials were available in this environment,
so I could not drive the actual expand/collapse interaction in a browser — only confirm the dev
server boots and serves the unauthenticated shell cleanly (`pnpm run dev`, `http://localhost:5173/
habits-tracker/` returns 200). Please spot-check yourself: open a habit's description toggle next
to the hide button (both a fully-filled habit like "Спорт" and an empty one like "Бэкэнд"), confirm
multiple can stay open at once, and check both mobile and desktop widths.
