# 06: Migrate date handling from hand-rolled utils to dayjs

**What to build:** All date arithmetic and formatting in the app goes through the `dayjs` npm package instead of hand-rolled `Date`/`Intl` code. `src/lib/dates.ts` keeps only logic dayjs doesn't provide natively (`monthGridWeeks`, `formatWeekRange`, `formatMonthYear`, `weekdayLabels`); everything dayjs already does (parsing, `.add()`, `.startOf()`, `.isSame()`, `.daysInMonth()`, `.format()`) is called directly via `import dayjs` at call sites, no wrapper.

Locale is global and single-switch: `dayjs.locale('ru')` (set once, in `src/lib/dayjsSetup.ts`) drives both text formatting and week-start together. Each locale's own native `weekStart` applies as-is (Russian → Monday, English → Sunday later) — no manual override needed to reproduce current app behavior.

Storage format (ISO `yyyy-mm-dd` strings in the data schema) is untouched — this is app-logic only, per grilling round 4.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `dayjs` added as a real dependency (not hand-rolled), `src/lib/dayjsSetup.ts` registers the `ru` locale + `isSameOrBefore` plugin and sets `dayjs.locale('ru')` globally, imported once from `src/main.tsx`
- [x] `src/lib/dates.ts` no longer exports `toISODate`/`parseISODate`/`addDays`/`startOfWeek`/`startOfMonth`/`addMonths`/`daysInMonth`/`isSameDate`/`WEEKDAY_LABELS` — callers use dayjs directly for these; only `monthGridWeeks`/`formatWeekRange`/`formatMonthYear`/`weekdayLabels` remain, reimplemented on top of dayjs
- [x] `src/lib/streak.ts` (`calculateStreak`/`calculateBestStreak`) reimplemented using dayjs internally, same observable behavior, `today` parameter is now a `Dayjs`
- [x] `WeekPage.tsx`/`StatsPage.tsx`/`MonthHeatmap.tsx`/`useHabitsView.ts` migrated to dayjs; the two ad-hoc bypasses in `WeekPage.tsx` (`date.slice(8,10)` day-of-month extraction, raw `new Date()` + `Intl.DateTimeFormat` for the entry-popup date label) are also migrated, consistent with the rest
- [x] `addMonths`-equivalent month navigation now uses dayjs's default `.add(n, 'month')` end-of-month clamping (more correct than the old flat-28-day clamp) — deliberate, approved behavior change
- [x] `streak.test.ts` updated for the `Dayjs`-typed `today` parameter; no new test files added for logic dayjs now covers directly (per grilling round: behavior-preserving refactor, existing tests are the regression guard)
- [x] `pnpm test`, `pnpm run build`, and `pnpm run lint` all pass clean
- [x] Manually verified in the browser (Playwright, headless Chromium): week view Monday-start unchanged (Пн–Вс, correct dates, "24 – 30 августа 2026" week range), month view unchanged ("Август 2026"), Stats heatmap weekday labels correctly Monday-first, entry-popup date label reads "понедельник, 24 августа" — zero console/page errors across all screens

## Comments

Scope and design decided via a grilling session (see conversation) rather than written to `CONTEXT.md`/an ADR, per explicit user instruction for this ticket.

Code review (`/code-review` vs this ticket, diff against HEAD 71170c0): Spec axis found zero missing/partial requirements and zero scope creep. Standards axis found no hard violations; two minor judgement-call smells noted (the `"YYYY-MM-DD"` format-string literal and `isSame(x, unit)` comparison shape each recur ~6-7 times across files with no shared helper) — left as-is since introducing a wrapper for either would cut against this ticket's explicit API-boundary rule (call dayjs directly, don't wrap what it already does natively).
