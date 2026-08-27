# 08: Light/dark theme toggle

**What to build:** A binary light/dark theme toggle, per a grilling session (no separate written spec — decisions recorded live in `docs/adr/0006-theme-preference-uses-localstorage.md`). The Tailwind/CSS side is already fully ready from the shadcn migration (complete `:root`/`.dark` variable sets, `@custom-variant dark (&:is(.dark *))` already wired) — this ticket is purely the JS/React wiring plus the toggle UI:

1. **Theme store (`useTheme` hook).** No React Context (none is used anywhere else in this codebase) — a module-level store backed by `useSyncExternalStore`. Persisted state is either absent (→ follow OS `prefers-color-scheme` live) or an explicit `"light"`/`"dark"` pinned in `localStorage`. Once the user toggles, the choice is pinned forever — there is no in-app way back to "follow system." The store's subscribe function listens to both the local in-page update and the `storage` event, so toggling in one tab updates other open tabs immediately.
2. **FOUC prevention.** Replace the hardcoded `class="dark"` on `<html>` in `index.html` with a small blocking inline `<script>` in `<head>`, run before any stylesheet/app script, that reads the `localStorage` key (falling back to `matchMedia('(prefers-color-scheme: dark)')` when absent) and sets/removes `.dark` on `document.documentElement` before first paint.
3. **Toggle button.** Icon-only `Button` (existing `icon` size variant) in the shared nav bar (`src/routes/Layout.tsx`), right-aligned alongside the existing "Неделя"/"Статистика" links. Swaps between `lucide-react` sun/moon icons reflecting the _current_ theme (sun while light, moon while dark). Russian `aria-label` describing the action and updating with current state: `"Переключить на светлую тему"` / `"Переключить на тёмную тему"`.

**Blocked by:** None

**Status:** done

- [x] `useTheme` hook (module-level store + `useSyncExternalStore`, no Context) reading/writing a `localStorage` theme key, cross-tab synced via the `storage` event, plus a live `matchMedia` `change` listener while unpinned
- [x] Inline blocking script in `index.html` sets `.dark` on `<html>` before first paint from `localStorage` (falling back to `matchMedia`); hardcoded `class="dark"` removed
- [x] Theme toggle button wired into `src/routes/Layout.tsx`'s nav bar, right-aligned, using existing `Button` icon variant + `lucide-react` sun/moon icons + Russian `aria-label`
- [x] `pnpm test`, `pnpm run lint`, `pnpm run build` all pass clean
- [x] Manually verified in browser by the user — confirmed working

## Comments

Scope and design decided via a grilling session (`/grill-with-docs`), same pattern as tickets 06/07. See `docs/adr/0006-theme-preference-uses-localstorage.md` for why this feature uses `localStorage` despite [ADR-0003](../../../docs/adr/0003-local-storage-is-a-real-json-file.md) rejecting it for domain data — the distinction is client-only UI preference vs. domain data.

`/code-review` (two-axis) ran against the diff. Standards axis: no hard violations; two minor judgement-call smells (a duplicated "is this a valid stored theme" check across `theme.ts`/`useTheme.ts`, and `prefersDarkScheme` exported without a second caller) — both fixed by extracting a shared `isExplicitTheme` guard and folding the matchMedia access behind `getDarkSchemeMediaQuery`. Spec axis: found the store didn't actually track OS-preference changes live while unpinned (only read once at module init) — fixed by adding a `matchMedia` `change` listener in `useTheme.ts`'s `subscribe`, ignored once the user has pinned an explicit choice.
