# 05: Replace copy-pasted flame SVG with lucide-react's Flame icon

**What to build:** The flame icon used for streaks no longer lives as a copy-pasted SVG path in `src/components/StreakBadge.tsx` and `src/pages/StatsPage.tsx`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] The duplicated SVG path in `src/components/StreakBadge.tsx` and `src/pages/StatsPage.tsx` is gone, replaced by the `Flame` icon from `lucide-react` at both call sites
- [x] `pnpm run build` and `pnpm run lint` pass clean

## Comments

Implemented first as a hand-rolled shared `StreakIcon` component wrapping the original SVG path. Reworked by hand afterward to use `lucide-react`'s `Flame` icon directly at each call site instead, and restyled both spots along the way (icon/number order and sizing in `StreakBadge`, icon size in `StatsPage`) — so the original "no visual change" criterion no longer applies; the new look is intentional.
