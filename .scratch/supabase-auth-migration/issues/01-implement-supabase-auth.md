# 01: Implement Supabase authentication (single account, email/password)

**What to build:** Gate the whole app behind a Supabase-backed login, per a grilling session — no
separate written spec, decisions recorded live in
`docs/adr/0008-single-account-email-password-no-public-signup.md` and
`docs/adr/0009-service-role-key-stays-in-local-account-script.md` (which also updated
`docs/adr/0004-supabase-accessed-directly-from-frontend.md`).

- **Supabase client**: `@supabase/supabase-js` added as a dependency; `src/lib/supabaseClient.ts`
  creates the client from `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` (Vite env vars,
  `.env.local`, never committed; `.env.example` checked in with placeholders), throwing a clear
  error at startup if either is missing.
- **Auth state**: `src/hooks/useAuth.ts`, mirroring `useTheme.ts`'s module-singleton +
  `useSyncExternalStore` pattern — one `onAuthStateChange` subscription for the whole app,
  exposing `{status: "loading" | "signed-out" | "signed-in", session?, signIn, signOut}`.
- **Route gating**: a `RequireAuth` wrapper (`src/routes/RequireAuth.tsx`) redirects to `/login`
  when signed out, shows a loading state while the initial session check is in flight, and
  renders `<Outlet/>` once signed in. Wraps the existing `Layout`+routes in `App.tsx`; `/login`
  itself stays outside `Layout` (no nav while signed out).
- **Login screen**: `src/pages/LoginPage.tsx`, hand-rolled (not `@supabase/auth-ui-react` —
  archived) against the existing design system, using a new shadcn `Input` component.
  Email/password form calling `signInWithPassword`; errors mapped to Russian user-facing text via
  `src/lib/authErrors.ts` (unit-tested).
- **Sign out**: a control in `Layout`'s nav, next to the theme toggle, visible only when signed
  in.
- **Account provisioning**: `scripts/create-account.mjs` (gitignored, alongside
  `scripts/extract_seed_data.py`) — one-off, create-only, calls `auth.admin.createUser` with
  `email_confirm: true` via the `service_role` key read from env vars, never the app itself.

**Out of scope** (explicitly deferred, see ADR-0008/0009 and the grilling transcript): magic
link, OAuth, custom SMTP, in-app password reset, the actual GitHub Pages deploy pipeline, and the
habits-data Supabase migration.

**Blocked by:** None for the code. Actually provisioning a real Supabase project (creating it,
getting real URL/keys, disabling public sign-up, running the account script) is a separate
manual/guided step — not blocking code review, but required before the login screen works
against a real backend.

**Status:** done

- [x] `@supabase/supabase-js` installed; `src/lib/supabaseClient.ts` reads env vars, throws
      clearly if missing
- [x] `.env.example` added; `.env*.local` gitignored
- [x] `useAuth` hook (module-singleton `onAuthStateChange`, loading/signed-out/signed-in states)
- [x] `RequireAuth` gates `Layout`'s routes; `/login` route stays ungated and nav-free
- [x] `LoginPage` (email/password form, shadcn `Input`, Russian error messages via
      `authErrors.ts`)
- [x] Sign-out control in `Layout` nav
- [x] `scripts/create-account.mjs` (create-only, service_role key via env, never committed)
- [x] `pnpm test`, `pnpm run lint`, `pnpm run build` all pass clean
- [x] Manually verified in dev server: unauthenticated visit to `/` redirects to `/login`; login
      form shows a mapped error on bad/unreachable credentials; `/login` has no nav

## Comments

Scope and decisions came from a `/grill-with-docs` session (2026-08-27) — see ADR-0004
(updated)/0008/0009. Actual Supabase project provisioning (creating the project, real keys,
disabling public sign-up, running the account script with real credentials) is a manual step
outside this ticket's automatable scope; use `/wizard` for that walkthrough once this code is
merged.

`/code-review` (Standards + Spec) found no hard violations and no scope creep. Two smells fixed:
duplicated full-page loading markup between `App.tsx` and `RequireAuth.tsx`, extracted to
`src/components/LoadingScreen.tsx`; `LoginPage`'s submit handler only reset `submitting` on the
error path, relying on an implicit ordering with `useAuth`'s listener on success — now resets
unconditionally. Two accepted as-is: `useAuth.ts` re-implements `useTheme.ts`'s external-store
scaffold rather than sharing a helper (only two consumers so far, premature to abstract);
`authErrors.ts` matches Supabase's literal English error-message strings rather than an error
code (fragile to upstream wording changes, but fails safe to a generic message).
