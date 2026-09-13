Status: ready-for-human

# Migrate habit data from local JSON to Supabase

## Description

Move `data/habits-data.json` (habits, quick answers, entries) into Supabase tables; replace
`jsonFileDataStore` with `supabaseDataStore` behind the existing `DataStore` interface. Decisions:
ADR-0010/0011/0012/0013.

## Acceptance criteria

- [x] `dataStore.ts`/`supabaseDataStore.ts` (+ unit tests mocking the Supabase client)
- [x] Data-layer hooks and `WeekPage`/`StatsPage`/`DayGrid` reworked for windowed entries +
      per-habit streaks
- [x] `App.tsx` cut over to `supabaseDataStore`; old JSON-file store/API deleted
- [x] `scripts/migrate-habits-data.mjs` written (gitignored, re-runnable, upserts by natural key)
- [x] `get_habit_streaks` RPC written, hand-verified against `streak.test.ts`
- [x] `pnpm test`/`lint`/`build` all pass clean
- [x] `habits`/`quick_answers`/`entries` tables + RLS + RPC applied to Supabase, migration script
      run — done by the user directly, not independently verified by the agent
- [x] `@tanstack/react-query` added for caching (ADR-0013)
- [ ] Row counts / spot-check verified between the JSON file and the Supabase tables
- [ ] `get_habit_streaks` re-verified against a live Postgres
- [ ] Manually verified in dev server: day grid, entry editing, visibility toggle, Stats tab, zero
      console errors

## Comments

Tables/RPC applied to Supabase and migration script run by the user directly — the three
unchecked items above are what's left before this is fully done.
