# 02: Wire up habit-visibility toggle in the UI

**What to build:** From the Неделя screen, the user can hide a habit they no longer want cluttering the daily grid, and can later find and bring back a hidden habit — closing spec scenarios 13–14 (hide/show a habit without losing its history).

**Blocked by:** None (can start immediately)

**Status:** done

- [x] A visible, discoverable control (e.g. on `HabitRow`/`GroupHeader`) lets the user hide a habit; it disappears from the Неделя grid immediately
- [x] A way to see which habits are currently hidden and re-show one (a hidden-habits list/section is enough — doesn't need its own route)
- [x] `App.tsx` destructures and threads `toggleHabitVisibility` from `useHabitsData` down to wherever the control lives
- [x] Hiding/showing a habit does not touch its `DayEntry` history — re-showing it restores all prior data untouched
- [x] The unused `entryFor()` helper in `src/lib/habitsData.ts` is removed if it's still unreferenced once this lands
- [x] `pnpm run build` and `pnpm run lint` pass clean
