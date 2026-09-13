---
status: accepted
---

# Day-table view reopens continuous scroll, but only for a second mode

[ADR-0007](0007-paginated-day-grid-instead-of-continuous-scroll.md) replaced continuous
virtualized scroll (from [ADR-0005](0005-virtualize-day-grid-render-ahead-of-lazy-data-loading.md))
with a paginated grid and dropped `@tanstack/react-virtual` — on narrow screens, virtualization
needed a fixed per-cell pixel width, which didn't allow stretching the grid to fill its container.
That decision still stands: the regular grid (`DayGrid`, habits as rows, dates left-to-right)
stays paginated.

Alongside it, the week screen gets a second, independent display mode — the day table
(`DayTable`): dates top-to-bottom, habits as columns left-to-right, matching the original
`data.xlsx` layout. This mode serves a different job — not fast entry for the current week, but
browsing history of arbitrary depth — and ADR-0007's paginated model doesn't fit that job: paging
through years of history with buttons or swipes isn't practical. So the table view uses continuous
vertical scroll with row virtualization (`@tanstack/react-virtual` comes back as a dependency, but
only this mode uses it), and loads entries in calendar-month chunks as the user scrolls, rather
than fetching the whole range up front.

The constraint that forced virtualization out in ADR-0007 doesn't apply here: habit columns still
stretch to fill their container via CSS grid (`minmax(88px, 1fr)`), same as the regular grid — just
with an 88px floor instead of 0. When the floor total exceeds the viewport (many habits on a narrow
screen), the container overflows and gets its own horizontal scroll with a sticky date column,
instead of squeezing columns unreadably thin. Row virtualization and stretchy columns don't
conflict here the way they did in the old model.

The date range isn't technically infinite (the virtualizer needs a finite `count`), but is chosen
generously into the past (5 years) and capped 10 days into the future — indistinguishable from
"unlimited" in practice for a personal habit tracker's past, which is what actually matters.

**Considered and rejected**: making `DayGrid` itself continuous again, reverting fully to the
ADR-0005 model. Rejected — the paginated model already serves fast entry for the current week
better than scrolling would, and its mobile responsiveness (stretchy cells, swipe) would be lost
for no gain. Two modes with different tradeoffs coexist instead of one universal one.
