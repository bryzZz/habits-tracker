Status: done

# Non-blocking loading: skeleton instead of full-page unmount

See `../spec.md` for full context. Depends on 01 (touches `WeekPage`'s use of the new view mode
for the grid skeleton's day count), but can largely be reviewed independently.

## Description

`QueryBoundary` currently swaps its entire `children` for a bare `<LoadingScreen/>` text whenever
`isLoading` is true — this includes `WeekPage`'s toolbar (nav arrows, "Сегодня", the view-mode
toggle) and `StatsPage`'s header/toggle. Any view-mode change or navigation to an unfetched range
makes the controls the user just interacted with disappear.

Redesign so the toolbar/header always stays mounted and interactive, and only the data-dependent
content area shows a page-shaped skeleton — and only after a short delay, so fast responses never
flash one.

## Acceptance criteria

- [x] `WeekPage` renders `DayGridToolbar` (or equivalent) outside the loading boundary — it never
      unmounts while entries/habits are loading.
- [x] `StatsPage` renders its header/toggle outside the loading boundary likewise.
- [x] `QueryBoundary` (or its replacement) takes a caller-provided loading fallback instead of a
      hardcoded `<LoadingScreen/>`, so each page can supply a fallback shaped like its own content.
- [x] The fallback only appears after ~250-300ms of continuous loading; a load that resolves
      faster never shows it. One code path covers both a genuinely-first load and a subsequent
      range/view-mode change.
- [x] Nav arrows, the view-mode toggle, and "Сегодня" remain clickable while a fetch is in flight;
      rapid repeated navigation is not blocked and settles on the last request's result. Mobile's
      swipe gesture (its only nav control, per ADR-0007) was also lifted above the loading
      boundary for the same reason, even though not called out explicitly above.
- [x] Error state behavior is unchanged.
- [x] ADR from ticket 01 mentions this as a related consequence (no separate ADR).

## Comments

Implemented alongside ticket 01. `QueryBoundary` uses a 250ms delay (`LOADING_FALLBACK_DELAY_MS`)
before showing the caller's `loadingFallback`; resets the flag via the "adjust state during
render" pattern (already used elsewhere in this codebase, e.g. `useStats.ts`) rather than a
setState-in-effect, to satisfy the `react-hooks/set-state-in-effect` lint rule. `DayGridSkeleton`
and `StatsSkeleton` added as the two pages' loading fallbacks, built on a newly-added shadcn
`Skeleton` primitive. Not verified against the live authenticated app — see ticket 01's comment.
