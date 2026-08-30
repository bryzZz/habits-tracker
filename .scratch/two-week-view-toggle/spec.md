# Explicit "Две недели" view + non-blocking loading

Resolved via a grilling session on 2026-08-30.

## Context

The day-grid toolbar (`WeekPage`) currently toggles between "Неделя" (7 days on mobile, 14 on
desktop — a hidden device-dependent doubling from ADR-0007) and "Месяц" (a real calendar month).
Switching either the view mode or navigating to an unfetched date range triggers React Query
`isLoading`, which `QueryBoundary` turns into a full unmount of the page — including the toolbar
itself, so the controls the user just clicked disappear.

## Decisions

1. **Add a third, explicit view mode**: Неделя / Две недели / Месяц, on the `DayGridToolbar`
   (`WeekPage`) only — `StatsPage`'s separate week/month toggle (which only affects a client-side
   computation, not a fetch) is out of scope.
2. **Fixed, device-independent day counts**: "Неделя" = 7 days always, "Две недели" = 14 days
   always, on both mobile and desktop. This removes the desktop-only 14-day widening described in
   ADR-0007 in favor of an explicit user choice. "Месяц" is unchanged (real calendar month,
   variable length).
3. **Default view mode is "Две недели"** for a first-time visitor (no stored preference).
4. **The chosen view mode persists to `localStorage`**, following the existing pattern in
   `src/lib/theme.ts` (read-with-fallback / write helpers) — no cross-tab sync needed, this isn't
   a page-load-blocking preference like theme.
5. **Loading no longer unmounts the toolbar or any other already-rendered chrome.** `QueryBoundary`
   stops swapping `children` for a hardcoded `<LoadingScreen/>`. Instead, each page renders its
   navigation/toolbar unconditionally (outside the boundary) and passes a page-shaped skeleton as
   a fallback for the data-dependent content only. This applies to both `WeekPage` and `StatsPage`
   (same component, same behavior).
6. **The skeleton fallback appears only after ~250-300ms of loading** (not instantly), so fast
   responses never flash a skeleton. One code path handles this for both a genuinely first-ever
   load and a subsequent range/view-mode change — no separate "first load" special case.
7. **Controls are never disabled while a fetch is in flight.** The user can keep clicking
   nav/toggle controls; React Query resolves whichever request settles last.
8. One ADR records the ADR-0007 revision (dropping the desktop-only day-count widening) and
   mentions the `QueryBoundary` skeleton change as a related consequence.
9. No `CONTEXT.md` changes — view mode is a UI/presentation concern, not domain vocabulary.

## Out of scope

- `StatsPage`'s own week/month toggle.
- Any keepPreviousData/stale-content-dimming approach (superseded by the skeleton decision).
