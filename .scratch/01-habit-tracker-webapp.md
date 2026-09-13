Status: done

# Habit tracker web app (local JSON prototype)

## Description

Local-prototype rebuild of a Google Sheets habit tracker: ~15 habits across three priorities
(Приоритет/Работает/На паузе), two screens (Неделя daily grid, Статистика heatmap + per-habit
trend), streaks and independent score/note per day. Data lives in a real JSON file on disk (no
cloud/auth yet — that's later tickets); real history (~1291 day-entries since 2026-04-09) migrated
from the original spreadsheet via a one-off gitignored script. Domain rules (streak, overall
score, visibility) are in `CONTEXT.md`.

## Acceptance criteria

- [x] Vitest test infrastructure + tests for core pure logic (streak, score ramp, overall score)
- [x] Habit-visibility toggle wired into the UI (hide/show without losing history)
- [x] `user_id` field added to the data schema (Supabase future-proofing)
- [x] Shared `WeekPage`/`StatsPage` view setup consolidated into one hook
- [x] Shared streak icon (`lucide-react`'s `Flame`) replacing duplicated SVGs
- [x] Date handling migrated from hand-rolled utils to dayjs
- [x] Scrollable, virtualized day grid with a flat priority-dot habit list
- [x] Light/dark theme toggle
- [x] Mobile-responsive, paginated day grid (375px+)

## Comments

Reviewed slice-by-slice via `/code-review`. Notable fixed issues: an overall-score bug, a stale
theme-preference live-update gap, duplicated block-wrapper markup. Layout/theme decisions recorded
in ADR-0002, 0003, 0005 (superseded by 0007), 0006, 0007.
