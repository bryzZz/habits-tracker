Status: done

# Continuous-scroll table view (dates top-to-bottom)

## Description

A second layout mode for the week screen, next to the existing paginated left-to-right grid:
dates run top-to-bottom (rows), habits run left-to-right (columns) — matching the original
`data.xlsx` orientation. Rows are virtualized (`@tanstack/react-virtual`) so only the visible
window is in the DOM; entries load in month-sized chunks as the user scrolls, with skeleton cells
shown for any date whose chunk hasn't resolved yet. A toolbar toggle switches between "Сетка" and
"Таблица"; a "Сегодня" button scrolls the table back to today.

Reached via a grilling session — see conversation history for the full round-by-round rationale.
This reopens a question ADR-0007 already settled once (continuous virtualized scroll vs paginated
grid) but for a different, coexisting mode rather than replacing the paginated grid — needs its own
ADR recording why both models now live side by side.

## Decisions from grilling

- Same page (`WeekPage`), mode toggle in the shared toolbar — not a separate route.
- Row order matches `data.xlsx`: ascending by date (oldest at top), scroll down = forward in time.
- Scroll bounds: unlimited into the past (in practice a large-but-finite index space, not a
  literal infinite list), future capped 10 days ahead of today.
- Cells stay clickable and open the existing `EntryPopup` — same editing model as the grid.
- The Неделя/Две недели/Месяц page-size toggle is hidden in table mode — it's a paginated-grid
  concept with no table equivalent.
- Mobile: sticky date column + horizontal scroll for habit columns (frozen-pane spreadsheet
  pattern), same on desktop.
- Column header: priority dot + habit name only. No streak badge, hide button, or description
  accordion — those stay exclusive to the grid.
- Hidden habits are not shown as columns in table mode (`HiddenHabitsAccordion` itself still
  renders below either mode — it's a management control, not a display of hidden data).
- Toolbar in table mode: range label and "Общий балл" are hidden (both are page-bound concepts);
  only the logo, the layout toggle, and a "Сегодня" button remain.
- Opens scrolled so today sits near the bottom of the viewport, with the small future buffer below
  it and history above.

## Acceptance criteria

- [x] `layoutMode` ("grid" | "table") toggle in `DayGridToolbar`, persisted like `viewMode`
- [x] `DayTable` component: virtualized rows (dates), sticky header row (habit names) and sticky
      first column (dates), horizontal scroll for habit columns
- [x] Entries fetched in month-sized chunks keyed to the visible + overscanned range, via
      `react-query`; unresolved chunks render skeleton cells, not blank ones
- [x] `useSaveEntryMutation` generalized to patch any cached `entries` range containing the saved
      date (needed since table mode has several chunk queries live at once, unlike the grid's one
      fixed range) — grid mode keeps working unchanged
- [x] Clicking a cell opens the same `EntryPopup` editing flow as the grid
- [x] "Сегодня" button scrolls the table to today; opening table mode starts there too
- [x] Неделя/Две недели/Месяц toggle, range label, and "Общий балл" are hidden in table mode
- [x] New ADR recording this decision alongside ADR-0007
- [x] Existing tests (`dayGrid.test.ts`, etc.) still pass; `pnpm run lint` and `pnpm run build`
      clean

## Comments

Reviewed via `/code-review`; fixed two real bugs (`scrollToToday` landed on `range.count - 1`
instead of `range.todayIndex`; initial scroll raced `@tanstack/react-virtual`'s own layout effect
and lost, fixed via `initialOffset` + a plain `useEffect`) and deduped entry-indexing/date-range
logic into `indexEntriesByHabit`/`isISODateInRange`. Not exercised against the live app — user
spot-checked manually and asked for several rounds of visual polish (spacing, sticky-column width,
scrollbar theming, future bound fixed to `TABLE_FUTURE_DAYS`).

Consolidated `EntryPopup`: grid and table each wired their own `useSaveEntryMutation`/
`useEntryPopup`. Now a single instance lives in `WeekPage`, and `useEntryPopup` takes the clicked
entry directly instead of looking it up from a stored map.
