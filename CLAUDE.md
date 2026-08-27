## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (root `CONTEXT.md` + `docs/adr/`). See `docs/agents/domain.md`.

### Coding standards

Component/hook/export/comment/JSX/Tailwind conventions for `src/**`. See `CODING_STANDARDS.md`.

## Package manager

pnpm only — never npm or yarn (`pnpm install`, `pnpm run <script>`, `pnpm dlx`).
