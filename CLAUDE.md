## Agent skills

- **Issue tracker** — issues live as flat markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.
- **Triage labels** — default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.
- **Domain docs** — single-context layout (root `CONTEXT.md` + `docs/adr/`). See `docs/agents/domain.md`.
- **Coding standards** — component/hook/export/comment/JSX/Tailwind conventions for `src/**`. See `CODING_STANDARDS.md`.

## Language

- Respond to the user in chat in Russian.
- Write everything else — documentation, code comments, commit messages, PR descriptions, issue files — in English.

## Commits

- Don't add a `Claude-Session` line — `Co-Authored-By` only.

## Package manager

- pnpm only — never npm or yarn (`pnpm install`, `pnpm run <script>`, `pnpm dlx`).
