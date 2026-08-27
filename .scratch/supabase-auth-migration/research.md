# Supabase Auth — Research for Design Interview

Factual background only, gathered from primary sources (official Supabase docs at supabase.com/docs, and the `@supabase/auth-ui-react` GitHub repo / npm listing). No recommendations included — this feeds a later design conversation, which still needs to decide single-user vs multi-user.

---

## 1. Auth methods Supabase supports

- **Email & password** — built in, no extra provider setup. [Auth overview](https://supabase.com/docs/guides/auth)
- **Magic link (passwordless email OTP)** — built in, no extra provider setup; calls `signInWithOtp`. [Auth overview](https://supabase.com/docs/guides/auth)
- **OAuth / social login** — 19 providers documented: Apple, Azure (Microsoft), Bitbucket, Discord, Facebook, Figma, GitHub, GitLab, Google, Kakao, Keycloak, LinkedIn, Notion, Slack, Spotify, Twitter, Twitch, WorkOS, Zoom. Each needs provider-side setup (registering an OAuth app to obtain a client ID/secret) before use. Any other OAuth2/OIDC-compatible IdP can be wired up via "Custom OAuth/OIDC Providers." [Social Login guide](https://supabase.com/docs/guides/auth/social-login)
- **Phone/SMS OTP** — requires enabling phone auth in the Auth Providers page/config **and** configuring a third-party SMS provider account (MessageBird, Twilio, Twilio Verify, Vonage, or TextLocal) with valid credentials — does not work out of the box. Docs flag rate-limiting/CAPTCHA to control SMS cost, plus regional regulatory considerations. Codes are 6-digit, must be verified within a documented window, expire after an hour, and can be requested at most once per 60s. [Phone Login guide](https://supabase.com/docs/guides/auth/phone-login)
- **Enterprise SSO/SAML 2.0** — supported for IdPs compatible with SAML 2.0 (Google Workspace, Okta, Auth0, Azure AD, PingIdentity, OneLogin, etc.). **Requires a Pro plan or above**, is off by default, and is configured via the Supabase CLI (`supabase sso add`) using IdP metadata (XML/URL); billed at $0.015 per SSO MAU above plan quota. [Enterprise SSO/SAML guide](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml)
- Also available: Multi-Factor Authentication (TOTP or phone) as a second factor. [Auth overview](https://supabase.com/docs/guides/auth)

---

## 2. Client SDK setup for Vite + React

- `createClient(supabaseUrl, supabaseKey, options?)` — required params are the project URL and a key; `options.auth` accepts `autoRefreshToken`, `persistSession`, `detectSessionInUrl`, and a custom `storage` implementation. [JS reference: initializing](https://supabase.com/docs/reference/javascript/initializing)
- Official Vite/React quickstart env var convention: a `.env.local` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, read via `import.meta.env.VITE_*` (Vite's standard client-exposure prefix), then:
  ```js
  import { createClient } from "@supabase/supabase-js";
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  );
  ```
  [Use Supabase with React quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs) · [Auth quickstart for React](https://supabase.com/docs/guides/auth/quickstarts/react)
- **The anon/publishable key is explicitly safe to expose client-side.** Docs state it is "Safe to expose online: web page, mobile or desktop app, GitHub actions, CLIs, source code." Security is enforced through **Postgres Row Level Security (RLS)**, not key secrecy: unauthenticated requests use the `anon` Postgres role, authenticated requests use `authenticated`, and RLS policies attached to those roles gate data access — "key retrieval is always possible from a public component." The `service_role`/secret key is the one that must stay server-only (it has `BYPASSRLS`). [API Keys guide](https://supabase.com/docs/guides/api/api-keys)
- **Terminology note (confirms the prompt's warning):** Supabase is transitioning from legacy JWT-based keys (`anon` / `service_role`) to new-format keys (`sb_publishable_...` / `sb_secret_...`); both schemes currently coexist, with the legacy scheme slated for deprecation by end of 2026. [API Keys guide](https://supabase.com/docs/guides/api/api-keys)

---

## 3. Session handling in a SPA

- **Persistence**: by default `persistSession` is `true` and the session is stored in `localStorage`; if no storage is available in the environment, the client logs a warning and you must supply a custom `storage` implementation. [JS reference: initializing](https://supabase.com/docs/reference/javascript/initializing)
- **Auto refresh**: `autoRefreshToken` controls this; "Supabase's client libraries always try to refresh the session ahead of time" so tokens don't expire mid-request. A refresh token is single-use but tolerated for reuse within a default 10-second window (helps with race conditions). Default access-token expiry is 1 hour, configurable in Auth settings (docs advise against going below 5 minutes). [Sessions guide](https://supabase.com/docs/guides/auth/sessions)
- **`onAuthStateChange`**: `supabase.auth.onAuthStateChange((event, session) => {...})`, returns a subscription you `unsubscribe()` from. Documented event types: `INITIAL_SESSION`, `SIGNED_IN`, `SIGNED_OUT`, `PASSWORD_RECOVERY`, `TOKEN_REFRESHED`, `USER_UPDATED`. [JS reference: onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
- **React context/provider pattern**: no officially documented React Context/Provider wrapper pattern was found on supabase.com/docs. The official React quickstart and the "Build a User Management App with React" tutorial both use `getClaims()` (verifies the local JWT) / `getUser()` (network call) / `getSession()` (reads local storage) directly in components rather than showing a canonical `AuthProvider` implementation. [Auth quickstart for React](https://supabase.com/docs/guides/auth/quickstarts/react) · [React tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)

---

## 4. Restricting to a single/private user

- **Dashboard setting**: Authentication settings (Project Settings → Authentication → "User Signups" section) has a toggle **"Allow new users to sign up."** Docs state: "Users will be able to sign up. If this config is disabled, only existing users can sign in." Disabling it only blocks the public `signUp()` flow — it does not block admin-created/invited accounts from signing in. Related nearby toggles: "Allow anonymous sign-ins," "Allow manual linking." [General configuration guide](https://supabase.com/docs/guides/auth/general-configuration)
- **Manually creating a single account, three documented routes:**
  1. **Dashboard UI** — Authentication → Users → **Add user** → **Send invitation**, entering the user's email; this creates an unconfirmed user and emails them an invite/confirmation link. [Users guide](https://supabase.com/docs/guides/auth/users)
     - Community reports (GitHub discussions, not the primary docs page) also describe a **"Create new user"** option in the same Add-user menu, with an "Auto Confirm User" checkbox and a password field, letting an admin set a password directly without sending an email — this specific sub-flow is not spelled out in the official docs prose itself, so treat it as commonly-observed dashboard behavior rather than a documented guarantee.
  2. **Admin API** — `supabase.auth.admin.createUser({ email, password, email_confirm: true, ... })`. Docs are explicit this "should only be called on a server. Never expose your `service_role` key in the browser." [JS reference: admin.createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
  3. **CLI** — no dedicated `supabase` CLI subcommand for creating an auth user was found. Community guidance for seeding a local/self-hosted `auth.users` row explicitly says you cannot `INSERT` directly into `auth.users` from `seed.sql` due to schema triggers/constraints, and instead recommends running a script that calls the Admin API (`auth.admin.createUser`) with the local service-role key.

---

## 5. Email-based flow infrastructure requirements

- **Site URL**: "The Site URL in URL Configuration defines the default redirect URL when no `redirectTo` is specified in the code," and is described as "critical for email confirmations and password resets." Default value out of the box is `http://localhost:3000`. [Redirect URLs guide](https://supabase.com/docs/guides/auth/redirect-urls)
- **Redirect URL allow-list**: any URL passed as `redirectTo` (magic link, password reset, OAuth, etc.) must match an entry in this allow-list, configured in the dashboard (or the local config file for local dev/self-hosted). [Redirect URLs guide](https://supabase.com/docs/guides/auth/redirect-urls)
- **Localhost works in local dev**: yes — the docs' own examples (Netlify/Vercel setups) explicitly recommend adding entries like `http://localhost:3000/**` to the allow-list for local development, and self-hosted/local projects configure Site URL/redirect URLs via the local config file rather than the dashboard. [Redirect URLs guide](https://supabase.com/docs/guides/auth/redirect-urls)
- **Default built-in email service limits and gotchas** (the shared, non-custom-SMTP sender):
  - Rate limit: **2 emails per hour**, changeable only by configuring custom SMTP. [Rate Limits guide](https://supabase.com/docs/guides/auth/rate-limits)
  - Recipient restriction: mail can only be sent to **pre-authorized addresses** (i.e., accounts/team members on the Supabase organization) — sending to arbitrary outside addresses without custom SMTP fails with an "Email address not authorized" error. [SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp)
  - No SLA: described as "best-effort only," positioned for exploration/team testing, not production. Supabase explicitly urges configuring custom SMTP (Resend, AWS SES, Postmark, SendGrid, etc.) for anything beyond a toy/demo. [SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp)
  - Related per-endpoint request-cooldown rate limits (independent of the email-sending cap above): OTP requests default to 30/hour project-wide with a 60-second cooldown per user; `/auth/v1/signup` and `/auth/v1/recover` both default to a 60-second cooldown before the same user can re-request. [Rate Limits guide](https://supabase.com/docs/guides/auth/rate-limits)

---

## 6. Recommended minimal auth UI pattern

- **Hand-rolled minimal pattern shown in official JS reference docs** — call the auth methods directly from a custom form, e.g.:
  ```ts
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  ```
  [JS reference: signInWithPassword](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
  ```ts
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: "https://yourapp.com/welcome" },
  });
  ```
  [JS reference: signInWithOtp](https://supabase.com/docs/reference/javascript/auth-signinwithotp)
  The official "Build a User Management App with React" tutorial itself builds its `Auth.jsx` component around magic-link sign-in (`signInWithOtp`) rather than a prebuilt component. [React tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- **`@supabase/auth-ui-react` (prebuilt themed UI library) — archived / unmaintained:**
  - The GitHub repo (`supabase/auth-ui`) shows: **"This repository was archived by the owner on Oct 23, 2025. It is now read-only."** [supabase/auth-ui on GitHub](https://github.com/supabase/auth-ui)
  - Earlier maintenance notice in the same repo, dated Feb 7, 2024, from the Supabase team: "this repository is no longer maintained by the Supabase Team. At the moment, the team does not have capacity to give the expected level of care to this repository," citing focus on Auth Helpers and other Auth primitives instead.
  - Per npm search results, the latest published version is **0.4.7**, last published roughly 3 years ago (i.e., no releases since well before the archival). [npm: @supabase/auth-ui-react](https://www.npmjs.com/package/@supabase/auth-ui-react)

---

## 7. Protecting routes with React Router in Declarative Mode

- No official Supabase documentation page, quickstart, or example was found that demonstrates gating routes in a `react-router` **Declarative Mode** app (`<BrowserRouter>` + `<Routes>`/`<Route>`, no data router). The official React quickstart and React tutorial both stop at "check the session/JWT inside a component" (`getClaims`/`getSession`/`getUser`) and do not show a router-level guard, wrapper, or redirect pattern. [Auth quickstart for React](https://supabase.com/docs/guides/auth/quickstarts/react) · [React tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- Because this repo does not use a React Router **data router**, loader-based route protection (`loader` functions checking auth before a route renders, as promoted in React Router's own data-router docs) is not applicable here regardless of what Supabase's docs do or don't show.
- What does exist, from primary sources, are only the underlying primitives to build a guard component yourself: `supabase.auth.getSession()` (reads the current session from local storage) and `supabase.auth.onAuthStateChange(...)` (listener with the event types listed in section 3) — both documented in the JS API reference, not wired into any official route-guard example. [JS reference: onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
- All concrete "protected route with react-router" implementations found (e.g. via search) were third-party blog posts / community templates, not Supabase-authored — consistent with the instruction to not treat those as primary sources; they are omitted here as not authoritative.
