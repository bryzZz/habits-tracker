Status: done

# Explicit "Две недели" view mode

See `../spec.md` for full context.

## Description

`DayGridToolbar`'s view toggle gains a third option, "Две недели", between "Неделя" and "Месяц".
Day counts become fixed and device-independent: week = 7 days, two-weeks = 14 days, on both mobile
and desktop (dropping ADR-0007's desktop-only 14-day widening of "Неделя"). Default view mode is
"Две недели"; the choice persists to `localStorage`.

## Acceptance criteria

- [x] `GridViewMode` is `"week" | "twoWeeks" | "month"`.
- [x] "Неделя" is 7 days on both mobile and desktop; "Две недели" is 14 days on both; "Месяц" is
      unchanged (real calendar month).
- [x] `DayGridToolbar` shows three toggle items: Неделя / Две недели / Месяц.
- [x] First-time visitor (nothing in `localStorage`) defaults to "Две недели".
- [x] Selecting a view mode persists it to `localStorage`; reloading restores the last selection.
- [x] `DayGrid`'s score label and range label read correctly for all three modes (no leftover
      `isDesktop`-based wording for the week/two-weeks distinction).
- [x] `StatsPage`'s own week/month toggle is untouched.
- [x] New ADR recording the ADR-0007 revision (`docs/adr/0014-...md`).
- [x] Existing `dayGrid.ts` unit tests pass; new tests cover the two-weeks case.

## Comments

Implemented alongside ticket 02 in the same pass. Verified via `tsc -b`, `vitest run`, `eslint`/
`prettier`, and `vite build`, all clean. Could not exercise the authenticated `WeekPage` UI in a
real browser — the app requires a real Supabase login (single-account, ADR-0008) and no test
credentials were available; verified instead that the unauthenticated app shell renders with no
console errors under Playwright. The user should spot-check the toggle/persistence behavior
themselves.
