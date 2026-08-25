# 01: Add Vitest test infrastructure + tests for core pure logic

**What to build:** `pnpm test` runs a real Vitest suite covering the app's pure business logic — a developer can run one command and see the streak, score-ramp, and overall-score rules verified against concrete inputs, not just eyeballed in the browser.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Vitest installed and configured for this Vite + React + TS project; `pnpm test` script added to `package.json`
- [x] `src/lib/streak.ts`: tests for `calculateStreak`/`calculateBestStreak` — an unfilled past day breaks the current streak (counts as 0, per ADR-0002), a partial/non-zero score keeps it alive
- [x] `src/lib/scoreRamp.ts`: tests that score 0 maps to the ramp's red end and score 1 (displayed as 10) maps to the green end
- [x] `src/lib/habitsData.ts`: tests for `overallScoreForDate` — a future date returns `undefined`, an unfilled past day counts as 0 for every visible habit, a hidden (`visible: false`) habit is excluded from the average
- [x] `pnpm test`, `pnpm run build`, and `pnpm run lint` all pass clean
