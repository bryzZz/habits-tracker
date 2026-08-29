---
status: accepted
---

# Habit ids are Supabase-generated UUIDs, not the current string slugs

When `habits` moves to Supabase, `id` becomes a database-generated UUID instead of today's hand-picked string slugs (`"chinese"`, `"sweets"`, …), with no `slug` column preserving them. Nothing in the app pattern-matches on a specific id string (only ever compared for equality), so nothing breaks; letting Supabase generate the key is the path of least resistance for a table meant to be edited by hand from the dashboard (per [ADR-0004](0004-supabase-accessed-directly-from-frontend.md)).

Considered keeping the slugs as primary key, or as a separate `slug` column alongside the UUID — rejected both: no extra column wanted, and the Table Editor already shows `name` next to the UUID, legible enough for 15 rows.
