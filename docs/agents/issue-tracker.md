# Issue tracker: Local Markdown

Issues live as flat markdown files in `.scratch/`.

- One ticket per feature: `.scratch/NN-slug.md`, numbered sequentially in creation order — no per-feature folders, no separate spec file.
- Triage state is a `Status:` line near the top of each file (see `triage-labels.md` for the role strings).
- Keep tickets short: title, a brief description, acceptance criteria only where genuinely useful, a `## Comments` section for conversation history appended at the bottom. No `Blocked by` field — mention a blocker in prose if it matters.
- When a skill says "publish to the issue tracker": create `.scratch/NN-slug.md`, with `NN` one past the highest existing number.
- When a skill says "fetch the relevant ticket": read the file at the referenced path or number.
