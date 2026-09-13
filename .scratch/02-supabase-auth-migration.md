Status: done

# Supabase authentication (single account, email/password)

## Description

Gate the app behind Supabase auth: single pre-created account, no public sign-up (ADR-0008,
ADR-0009). Magic link, OAuth, custom SMTP, and in-app password reset are explicitly out of scope.

## Acceptance criteria

- [x] `@supabase/supabase-js` client (`src/lib/supabaseClient.ts`) reads env vars, throws clearly
      if missing
- [x] `useAuth` hook (module-singleton `onAuthStateChange`, loading/signed-out/signed-in states)
- [x] `RequireAuth` route guard; `/login` stays ungated and nav-free
- [x] `LoginPage` (email/password form, Russian error messages via `authErrors.ts`)
- [x] Sign-out control in nav
- [x] `scripts/create-account.mjs` (create-only, service-role key via env, never committed)
- [x] `pnpm test`/`lint`/`build` all pass clean
- [x] Manually verified: unauthenticated visit redirects to `/login`; bad credentials show a
      mapped error; `/login` has no nav

## Comments

Reviewed via `/code-review`, no hard violations. Actual Supabase project provisioning (real keys,
disabling public sign-up, running the account script) is a manual step, done separately by the
user.
