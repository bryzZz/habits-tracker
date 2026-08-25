---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /code-review to review the work.

Check off the acceptance criteria this ticket satisfies and set `Status: done` in the ticket file.

Stop here and wait for explicit approval before committing. If the user asks for changes, apply them and use /code-review to review the work again.

Once approved, commit the work — including the updated ticket file — to the current branch.
