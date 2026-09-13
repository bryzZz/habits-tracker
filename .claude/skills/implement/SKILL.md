---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Any JSX/UI code in `src/` (components, pages, routes — anywhere markup is rendered), except
`src/components/ui/**`, follows the shadcn skill's conventions (semantic tokens, composition
rules).

Run typechecking regularly, and the full existing test suite once at the end — writing new tests
isn't required by default, but nothing existing may break.

Once the full test suite passes, run `pnpm run lint` and `pnpm run build`. Both must exit clean
before moving on — fix whatever they flag (lint autofixes what it can; anything left is a real
issue). Don't restate this as a per-ticket acceptance criterion; it's guaranteed by this step.

Once done, use /code-review to review the work.

Check off the acceptance criteria this ticket satisfies and set `Status: done` in the ticket file.

Stop here and wait for explicit approval before committing. If the user asks for changes, apply them and use /code-review to review the work again.

Once approved, commit the work — including the updated ticket file — to the current branch.
