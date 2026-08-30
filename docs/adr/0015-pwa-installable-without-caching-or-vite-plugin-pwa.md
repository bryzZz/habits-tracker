# PWA is installable but does no offline caching, and skips vite-plugin-pwa

The goal was only "installable, opens like an app" — not offline support. A web app manifest
alone is enough for iOS "Add to Home Screen" and for manual install via the Chrome menu (Chrome
108/112+ no longer require a service worker for menu-triggered install). We added a
`public/service-worker.js` anyway, but it's a no-op (empty `fetch` listener, no `respondWith`,
nothing cached) — it exists only so Chrome's automatic install-prompt heuristic, which still
checks for a registered fetch handler, can fire. Both the manifest and the service worker are
hand-written static files; `vite-plugin-pwa` was rejected because its Workbox-based tooling and
config only add surface area for a feature we deliberately don't want.

## Considered Options

- **No service worker at all**: simplest, but forgoes Chrome's automatic install banner/omnibox
  icon on Android/desktop (menu install still works). Rejected in favor of the no-op worker for
  slightly better discoverability, at zero caching cost.
- **`vite-plugin-pwa` with caching disabled** (`globPatterns: []`): generates manifest + SW
  registration, but pulls in Workbox for a worker that intentionally does nothing.
- **Real offline caching**: out of scope — this app reads live, potentially sensitive Supabase
  data, and stale cached reads are worse than a network error.

If offline support is ever wanted, this is the file to revisit — don't assume the current
`service-worker.js` is a stub waiting to be filled in without re-checking this trade-off.
