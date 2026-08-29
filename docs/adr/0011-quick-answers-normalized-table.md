---
status: accepted
---

# Quick answers live in their own table, not a JSONB column

Each habit's `quickAnswers` array — today nested inside the habit's JSON — becomes a separate `quick_answers` table with a `habit_id` foreign key (one row per preset), instead of a JSONB column on `habits`. [ADR-0004](0004-supabase-accessed-directly-from-frontend.md) already commits to managing this catalog through Supabase's Table Editor rather than custom admin UI, and a JSONB blob is much harder to edit preset-by-preset there than ordinary rows.

`quick_answers` carries no `user_id` of its own — ownership, and its RLS policy, go through the parent `habits` row via `habit_id`.
