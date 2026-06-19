---
name: SkillConnect DB setup
description: How the database is structured and initialized for SkillConnect
---

Tables: profiles, worker_details, jobs, bookings, reviews, messages — all with RLS.
Seed SQL is at `artifacts/skillconnect/SETUP.sql` — run once in Supabase SQL Editor.
Seed account password: `SkillPass123`.

**Why:** Supabase does not auto-create tables; the app silently returns empty results when tables don't exist.

**Key decisions:**
- worker rating is updated by a Postgres trigger (`trg_update_worker_rating`) on reviews insert
- `signIn` in AuthContext eagerly fetches the profile role and returns it so LoginPage can navigate without a setTimeout race
- Search query removed `.gt('rating', 0)` — seed workers start with explicit ratings set directly in SQL
- Realtime chat uses `postgres_changes` filtered on `receiver_id=eq.<userId>`; sender side is optimistic-local
- Customer dashboard and SearchWorkersPage both previously had `.gt('rating', 0)` filter — removed from both
