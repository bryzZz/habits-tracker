---
status: accepted
---

# Supabase data access: windowed entry reads, targeted writes, streaks via RPC

The habits-data migration replaces `DataStore`'s whole-blob `load()`/`save()` with a narrower shape:

- `entries` are fetched only for the date range on screen (the day-grid page, or the Stats period) — not the whole table. `habits`/`quick_answers` stay fetched in full, since they're small and unbounded by date.
- Writes (`saveEntry`, `setHabitVisibility`) are targeted single-row upserts/updates, not a rewrite of the whole dataset.
- Current/best streak — which needs a habit's entire history, not just the visible window — is computed by a `get_habit_streaks(habit_id)` Postgres RPC instead of scanning entries downloaded into the browser.

**Why**: the whole-blob approach fit a JSON file but not a real database — every entry edit would otherwise rewrite the entire `entries` table, and rendering one visible week would mean downloading the user's full history first. `entries` is already indexed on `(habit_id, date)`, which also covers the user's planned week/month Stats aggregates without a future schema change.

**Considered and rejected**: running streak values as columns on `habits`, updated on every write — rejected as duplicated state that could drift from `entries` (the source of truth), for little benefit given streak reads are far less frequent than entry writes.

**Consequences**: `WeekPage` navigation, previously instant (whole dataset in memory), now refetches per navigation — accepted as a reasonable cost with caching deferred, **superseded on that point by [ADR-0013](0013-tanstack-query-manages-the-supabase-data-layer.md)**. The windowed-reads/targeted-writes/RPC-streaks decisions above still stand.
