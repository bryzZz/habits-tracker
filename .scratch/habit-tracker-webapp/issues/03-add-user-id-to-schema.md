# 03: Add `user_id` field to the data schema

**What to build:** The local data schema matches what ADR-0004 already promises — a `user_id` field carried "про запас" so the future Supabase migration doesn't require a schema/type shape change, only a new `DataStore` implementation.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `user_id` (or equivalent) added to the relevant type(s) in `src/data/types.ts`, matching what ADR-0004 describes
- [x] `scripts/extract_seed_data.py` populates the field when regenerating `data/habits-data.json`
- [x] No behavior change in the app — this is purely a schema addition, existing screens keep working unmodified
- [x] `pnpm run build` and `pnpm run lint` pass clean
