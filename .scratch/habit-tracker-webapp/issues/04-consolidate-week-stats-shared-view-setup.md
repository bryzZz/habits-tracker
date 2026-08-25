# 04: Consolidate WeekPage/StatsPage shared view setup

**What to build:** WeekPage and StatsPage keep behaving exactly as before, but stop independently reimplementing the same "today / entries-by-habit / overall score" setup — one shared hook owns it, so the duplicated logic (and its parameter-clump call sites) can't drift out of sync again the way the overall-score bug did earlier.

**Blocked by:** 01 (adds a regression test locking in `overallScoreForDate`'s behavior as part of the consolidation, since this function already had one real bug fixed here before)

**Status:** done

- [x] A shared hook (e.g. `useHabitsView(data)`) extracted and consumed by both `WeekPage.tsx` and `StatsPage.tsx`, replacing their independent `today`/`todayISO`/`entriesByHabit` setup
- [x] `overallScoreForDate`'s call sites no longer thread the same 4 parameters by hand at each of the two locations
- [x] The near-identical previous/next nav-arrow buttons in `WeekPage.tsx` are consolidated (e.g. one component taking a direction prop)
- [x] A Vitest regression test for `overallScoreForDate` (or the new hook, if the logic moves) covers the same cases as before consolidation
- [x] Both screens are visually and behaviorally unchanged — verify manually (or via existing Playwright-style smoke check) that Неделя/Месяц toggle, streaks, and the heatmap/trend still render real data correctly
- [x] `pnpm test`, `pnpm run build`, and `pnpm run lint` all pass clean
