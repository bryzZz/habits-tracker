---
status: accepted
---

# TanStack Query manages the Supabase data layer

The data hooks in `src/data/` are now built on `@tanstack/react-query`'s `useQuery`/`useMutation` instead of hand-rolled `useState`+`useEffect`+cancellation-flag scaffolding — the user's explicit request after being talked through the tradeoff.

This reverses the caching/prefetching deferral in [ADR-0012](0012-supabase-data-access-windowed-reads-targeted-writes-streaks-rpc.md) ("a reasonable cost... not built speculatively now"). Everything else ADR-0012 decided still stands — windowed `entries` reads, targeted writes, and RPC-backed streaks work exactly the same; only _how_ results are cached and kept fresh changed. `WeekPage` navigation now benefits from real caching (revisiting an already-fetched range doesn't refetch), and saving an entry invalidates that habit's streak query directly, replacing a manually-threaded `refreshStreak` callback.

`DataStore` (`src/data/dataStore.ts`) and `supabaseDataStore.ts` are untouched — TanStack Query wraps the same `loadHabits`/`loadEntries`/`loadStreaks`/`saveEntry`/`setHabitVisibility` calls, it doesn't change what's fetched or how, only the state management around calling it.
