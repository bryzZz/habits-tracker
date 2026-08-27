# 09: Mobile-responsive, paginated day grid

**What to build:** Make the app usable on phones down to 375px width (portrait only), per a
grilling session (no separate written spec — decisions recorded live in
`docs/adr/0007-paginated-day-grid-instead-of-continuous-scroll.md`, which supersedes
`docs/adr/0005-virtualize-day-grid-render-ahead-of-lazy-data-loading.md`). One breakpoint
(Tailwind's `md`, 768px), via a `useIsDesktop` hook wherever layout structure — not just CSS —
needs to branch.

- **Day grid**: dropped `@tanstack/react-virtual`; renders only the current page (`dayGrid.ts`:
  `pageStartFor`/`datesInPage`/`stepPage`, unbounded — no more ±5-year limit). Cells stretch via
  CSS grid (`DayCellsRow.tsx`, no fixed pixel width). Week mode pages 14 days on desktop, 7 on
  mobile; month mode is always the full calendar month, cells shrink freely, no floor/fallback.
  Desktop navigates via arrow buttons (grouped before the range label, so it never shifts) and a
  clickable range label ("Сегодня" jump, disabled on today's page); mobile navigates via
  touch swipe only (discrete, not drag-follow) plus the same clickable label. Page-turn animation
  is scoped to the date header/cells/label/score — habit names don't move.
- **Mobile per-habit layout**: each habit stacks as name-row-then-cells-row instead of the
  desktop two-column split.
- **Nav** (`Layout.tsx`): single `<nav>`, pure CSS switches it between a top bar (desktop) and a
  fixed bottom tab bar (mobile); the theme toggle stays in the same nav, flipping from the right
  edge (desktop) to the left (mobile).
- **`StatsPage`**: sidebar stacks below the chart on mobile.
- **`EntryPopup`**: unchanged design; `max-h-(--radix-popover-content-available-height)` fixes a
  top-of-viewport clipping bug found on short mobile screens.
- Page padding shrinks on mobile; the average-score badge always renders (shows "N/A" instead of
  disappearing) and uses `tabular-nums` so it doesn't jitter width.

**Blocked by:** None

**Status:** done

- [x] Day grid repaginated (no virtualization, unbounded, responsive week/month page sizes)
- [x] Mobile stacked habit rows + swipe paging; desktop arrows + clickable range label
- [x] Single responsive nav (top bar / bottom tab bar) with a side-flipping theme toggle
- [x] `StatsPage` mobile stacking; responsive page padding
- [x] `EntryPopup` viewport-clipping fix; score badge always renders, stable width
- [x] `pnpm test`, `pnpm run lint`, `pnpm run build` all pass clean
- [x] Manually verified at 375px and 1280px (dev-tools emulation via throwaway Playwright
      scripts, since `chromium-cli` wasn't available)

## Comments

Scope and design decided via a `/grill-with-docs` session, same pattern as tickets 06/07/08; it
pivoted mid-grill from "make it fit" into overriding ADR-0005's scroll model once fixed-pixel
cell widths turned out to be the real blocker. Two `/code-review` passes (Standards + Spec) found
no missing requirements, no scope creep, and one minor duplication smell (fixed). The nav,
animation scope, and score-badge details went through several rounds of hands-on feedback after
the first working version — final shape is what's described above; the user also hand-tweaked a
few classes directly afterward.
