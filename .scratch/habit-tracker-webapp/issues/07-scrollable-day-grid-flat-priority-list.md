# 07: Scrollable day grid with flat priority-dot habit list

**What to build:** Redesign of the WeekPage grid, per a grilling session (no separate written spec — decisions recorded live in `CONTEXT.md` and `docs/adr/0005-virtualize-day-grid-render-ahead-of-lazy-data-loading.md`). Two independent changes bundled together:

1. **Priority accordions → flat list.** Drop the per-priority `Accordion`/`GroupHeader` grouping for visible habits. All visible habits render as one flat list (still ordered priority → active → paused), each row prefixed with a small colored dot (`PRIORITY_COLOR[habit.priority]`) carrying a `title` naming the priority. Priority no longer affects visibility/collapsing. The hidden-habits accordion is untouched.

2. **Scrollable, virtualized day grid.** Replace whole-page-swap week/month navigation with a horizontally scrollable grid:
   - One shared scroll container spans the date header and every habit's day cells (single synced `scrollLeft`); the habit-name column is a separate fixed-width flex column outside that container, so it never scrolls.
   - Content is laid out as repeating week blocks (7 cells, ~44px) or month blocks (~23px cells, whole month fits one screen width), toggled by Неделя/Месяц, separated by a 20px whitespace gap (`BLOCK_GAP_PX` in `dayGrid.ts`) — as many as fit the viewport.
   - Blocks are virtualized with `@tanstack/react-virtual` (horizontal), addressed by a fixed integer index relative to the origin block (today at mount); `src/lib/dayGrid.ts` holds the pure index↔dates math, bounded to ±5 years. `virtualizer.scrollToIndex`/`.range` didn't line up reliably with `getVirtualItems()`'s own offsets, so scroll position and the scroll-spy are driven by our own pixel math (`offsetForIndex`/`indexForOffset`) against the DOM's real `scrollLeft`; the virtualizer is only used for windowing. CSS scroll-snap was tried and dropped — it made JS-driven scrolls land short.
   - Arrow buttons scroll exactly one block (smooth); the container also scrolls via native wheel/trackpad; native scrollbar hidden. Click-and-drag panning and remapping plain vertical wheel to horizontal pan were both tried and are explicitly out of scope (the latter reverted after implementation — didn't feel right in practice).
   - The date-range label and "Сегодня" button track/target the leftmost visible block, updated on `scrollend`.
   - Today's `DayCell` gets a gray fill; `DayLabel` gets a rounded-rectangle `border-priority` outline around the whole label. Weekday labels are computed from each cell's own date (not grid position), so month view — whose first day isn't always a week boundary — labels correctly.
   - The header "Средний балл" stat is computed from the current leftmost block's dates. Habit streaks are unaffected by navigation — computed from `today`, same as before this change.
   - `DayGrid.tsx` owns the `useDayGrid` call and renders the nav/label/score row (`DayGridToolbar.tsx`) itself, so scroll-driven state updates re-render `DayGrid` only, not `WeekPage`. Row/cell components are memoized and callbacks passed down are stable, so a scroll gesture doesn't re-render all habit rows.

**Blocked by:** None

**Status:** done

- [x] `src/lib/dayGrid.ts`: pure index↔dates math + ±5-year bounds, unit tested (`dayGrid.test.ts`, 19 cases)
- [x] `@tanstack/react-virtual` added; `useDayGrid.ts` holds the virtualizer and returns one `DayGridLayout` object consumed by `DayGridHeader`/`HabitDayCells` via shared `DayGridBlockRow.tsx`
- [x] Flat priority-ordered habit list (`useVisibleHabits.ts`) with dot+name (`HabitNameCell.tsx`) and day cells (`HabitDayCells.tsx`) split out of the deleted `HabitRow.tsx`; `GroupHeader.tsx` and unused `PRIORITY_TINT` deleted
- [x] `DayGrid.tsx` + `DayGridToolbar.tsx` isolate scroll-driven re-renders away from `WeekPage.tsx`, which no longer calls `useDayGrid`
- [x] `EntryPopup` always-mounted with an outside-pointer-down guard (`data-entry-trigger`) to avoid flicker when re-anchoring to a new cell
- [x] `pnpm test` (36 tests), `pnpm run build`, `pnpm run lint:check` all pass clean
- [x] Manually verified in browser: week/month layout, arrow/wheel/trackpad navigation, label + "Сегодня" tracking, priority dots, today styling, entry popup, zero console errors

## Comments

Scope and design decided via a grilling session, per the same pattern as ticket 06. Implementation surfaced a scroll-perf regression (excessive re-renders during scroll, diagnosed with a throwaway Playwright script, not committed) fixed by the memoization/`DayGrid` extraction described above.

Two `/code-review` passes ran against this diff. The first found the ticket text had drifted from the implementation (sticky positioning and drag-to-pan described but never built, ±10 vs ±5 years, etc.) and a few Standards-axis smells (duplicated block-wrapper markup, a prop clump, `WeekPage.tsx` doing too much) — both fixed, and this text rewritten from scratch afterward to stay in sync. A second pass found only minor remaining smells (a stale comment, one magic number, small duplicated date-comparison logic) and one more spec/prose inaccuracy (the leftmost-block-dates claim applies to the score, not the streak) — left as judgement calls / corrected above, not worth further code churn.
