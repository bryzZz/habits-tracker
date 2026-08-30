---
status: accepted
---

# Explicit "Две недели" view replaces device-dependent week widening

[ADR-0007](0007-paginated-day-grid-instead-of-continuous-scroll.md) widened the "Неделя" page to
14 days on desktop only, to use screen space a fixed cell width used to waste — mobile stayed at
7 days. This meant the same label showed a different day count depending on device, with no way
for a mobile user to see 14 days or a desktop user to see just 7.

We're replacing that with a third, explicit view mode: Неделя (7 days) / Две недели (14 days) /
Месяц (calendar month), all with the same day count on both mobile and desktop. This supersedes
ADR-0007's device-dependent widening — the desktop use case it addressed is still served, just as
an explicit user choice instead of a hidden default, and mobile gains a way to see 14 days it
never had before.

As a related consequence, `QueryBoundary` moved from unmounting the whole page during a fetch to a
delayed, page-shaped skeleton that leaves the toolbar (including this new toggle) mounted and
interactive — see the component for the delay threshold and rationale.
