# 01: Migrate habits data from the local JSON file to Supabase

**What to build:** Move `data/habits-data.json` (habits, quick answers, entries) into Supabase
tables, and switch the app from `jsonFileDataStore` to a new `supabaseDataStore` — per a
`/grill-with-docs` session (2026-08-28). Decisions recorded live in
[ADR-0010](../../../docs/adr/0010-habit-ids-are-supabase-generated-uuids.md),
[ADR-0011](../../../docs/adr/0011-quick-answers-normalized-table.md),
[ADR-0012](../../../docs/adr/0012-supabase-data-access-windowed-reads-targeted-writes-streaks-rpc.md),
and [ADR-0013](../../../docs/adr/0013-tanstack-query-manages-the-supabase-data-layer.md).

## Schema

Written to [`supabase/schema.sql`](../../../supabase/schema.sql) (applied via the Supabase SQL
editor — no Supabase CLI migrations). One deviation from the approved draft: `get_habit_streaks`
takes a `p_today date` parameter instead of using the server's `current_date`, so the client's own
local "today" decides the streak boundary. The RPC body is a line-by-line port of
`calculateStreak`/`calculateBestStreak` (`src/lib/streak.ts`), hand-checked against every
`streak.test.ts` case but **not run against a live Postgres** — verify that before trusting it in
production.

## Data layer (`src/data/`, `src/hooks/`)

```ts
export interface DataStore {
  loadHabits(): Promise<Habit[]>; // habits + quick_answers, unfiltered
  loadEntries(range: DateRange): Promise<DayEntry[]>; // scoped to the visible range
  loadStreaks(
    habitId: string
  ): Promise<{ currentStreak: number; bestStreak: number }>;
  saveEntry(entry: DayEntry): Promise<void>;
  setHabitVisibility(habitId: string, visible: boolean): Promise<void>;
}
```

Replaces the whole-blob `HabitsData`/`load()`/`save()`. `supabaseDataStore.ts` implements it;
`@tanstack/react-query` wraps it via one hook per query/mutation (`useGetHabits`, `useGetEntries`,
`useGetHabitStreaks`, `useSaveEntryMutation`, `useHabitVisibilityMutation`), orchestrated for each
page by `useHabits.ts` (`WeekPage`) and `useStats.ts` (`StatsPage`). `Habit`/`DayEntry` dropped
`userId` — RLS + `default auth.uid()` own that now. `quickAnswers` is still a nested array on the
`Habit` consumers see; the normalized table (ADR-0011) is a storage detail joined in
`supabaseDataStore`. `entries` refetch on every navigation change (ADR-0012), cached by TanStack
Query (ADR-0013). Streaks show per-row in `DayGrid` too, not just on the Stats tab.

## Migration script

`scripts/migrate-habits-data.mjs` (gitignored, never committed) uses the `service_role` key from
env vars (ADR-0009's pattern) and a manually-supplied `ACCOUNT_USER_ID` — it doesn't look the user
up itself. It remaps each habit's old string id to a fresh UUID, carries that mapping into
`quick_answers`/`entries`, and is safely re-runnable: `habits` upserts by `(user_id, name)` (no
natural key per ADR-0010), `quick_answers` is delete-then-reinsert per habit, `entries` uses
`ON CONFLICT (user_id, habit_id, date)`.

## Cutover

Once migrated data is verified against the real Supabase project, switch `App.tsx` to
`supabaseDataStore` and delete `jsonFileDataStore.ts`, `vite-plugins/local-data-api.ts`, and the
`/api/habits-data` wiring. `data/habits-data.json` stays on disk as a gitignored backup.

**Out of scope:** Atomic Habits methodology fields, new stats UI/features, Supabase CLI migration
files.

**Blocked by:** None for the code. The unchecked items below need the real Supabase project's
dashboard and `service_role` key, which the implementing agent doesn't have.

**Status:** ready-for-human

- [x] `dataStore.ts`/`supabaseDataStore.ts` (+ unit tests mocking the Supabase client)
- [x] Data-layer hooks and `WeekPage`/`StatsPage`/`DayGrid` reworked for windowed entries + per-habit streaks
- [x] `App.tsx` cut over to `supabaseDataStore`; `jsonFileDataStore.ts`/`local-data-api.ts`/`/api/habits-data` deleted
- [x] `scripts/migrate-habits-data.mjs` written
- [x] `get_habit_streaks` RPC written and hand-verified against `streak.test.ts` (not against live Postgres)
- [x] `pnpm test` (42 passed), `pnpm run lint`/`lint:check`, `pnpm run build` all pass clean
- [x] `habits`/`quick_answers`/`entries` tables + RLS + RPC applied to Supabase, migration script run — done by the user directly (2026-08-28), not independently verified by the agent
- [ ] Row counts / spot-check verified between `data/habits-data.json` and the Supabase tables
- [ ] `get_habit_streaks` re-verified against a live Postgres
- [ ] Manually verified in dev server: day grid navigation, entry editing, visibility toggle, Stats tab all correct with zero console errors — user reports the app "seems to work," not yet itemized
- [x] `@tanstack/react-query` added (ADR-0013, amending ADR-0012's "no caching for now")

## Comments

Scope and decisions came from a `/grill-with-docs` session (2026-08-28); implemented via
`/implement` the same day. `tsc`, `pnpm test` (42/42), `lint:check`, and `build` all pass clean; a
dev-server smoke check confirmed the app boots with the new data layer, but the actual data flow
couldn't be exercised end-to-end (no real Supabase tables existed yet) — that's what the unchecked
checklist items above cover. `src/lib/streak.ts`/`streak.test.ts` are deliberately kept, now unused
by the app — they're the reference `get_habit_streaks` was ported from, not dead code.

`/code-review` found no Spec violations. Standards: two violations fixed (hook/derived-value
ordering in `WeekPage`/`StatsPage`; over-long comments); three smells fixed (`supabaseDataStore`'s
repeated error checks collapsed into an `unwrap()` helper; `DayGrid`'s loose props collapsed into
one `dayGrid` prop). One interleaving accepted as-is in `WeekPage` (`handleSaveEntry` must precede
the `useEntryPopup` call it feeds — a genuine dependency, not a memoization workaround).

The user then hand-reworked the data-fetching hooks directly, converging on the architecture
described above (one hook per query/mutation, orchestrated per-page) instead of grouped
`useHabits`/`useEntriesRange`/`useStreaks` hooks originally implemented. Explicit decisions worth
keeping:

- `DayGrid`/`DayGridHeader`/`HabitDayCells` take flat props, no `React.memo` — the user's call;
  ~15 habits isn't enough data to warrant memoization.
- `getOverallScore` in `useHabits.ts` deliberately does **not** treat a habit's unfilled days as 0
  within the window average, diverging from `overallScoreForDate`/CONTEXT.md's "Запись дня" rule —
  a reasoned choice ("я предполагаю что буду прилежно отмечать привычки"), not an oversight.
- `dayGrid.test.ts`/`habitsData.test.ts` were deleted by the user; the agent argued for restoring
  them (real coverage of date/score arithmetic — exactly the class of bug that shipped once
  already) but the user declined. Left deleted.
