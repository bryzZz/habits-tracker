// No-op: exists only so Chrome's install-prompt heuristic (which still checks
// for a registered fetch handler) fires. See docs/adr/0015. Caches nothing,
// intercepts nothing.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);
self.addEventListener("fetch", () => {});
