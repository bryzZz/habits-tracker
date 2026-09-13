Status: done

# Explicit two-week view + non-blocking loading

## Description

Added a third, device-independent view mode to `DayGridToolbar`, and fixed loading behavior so
navigation controls never disappear mid-fetch.

## Acceptance criteria

- [x] Third view mode "Две недели" (14 days) added alongside Неделя (7) / Месяц; day counts fixed
      and device-independent (drops ADR-0007's desktop-only 14-day widening)
- [x] Defaults to "Две недели" for a first-time visitor; persists to `localStorage`
- [x] New ADR recording the ADR-0007 revision (ADR-0014)
- [x] `QueryBoundary` no longer unmounts the toolbar/header while loading — only the data area
      shows a page-shaped skeleton
- [x] Skeleton fallback delayed ~250-300ms so fast responses never flash it
- [x] Nav controls (arrows, view toggle, "Сегодня", mobile swipe) stay usable during a fetch
- [x] Existing `dayGrid` tests pass; new tests cover the two-weeks case

## Comments

Reviewed via `/code-review`. Not exercised against the live authenticated app (no test credentials
in that environment) — user asked to spot-check the toggle/persistence/loading behavior directly.
