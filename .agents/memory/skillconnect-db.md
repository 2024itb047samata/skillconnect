---
name: SkillConnect DB setup
description: How the database is structured and initialized for SkillConnect; all schema decisions aligned to TypeScript types
---

Tables: profiles, worker_details, jobs, bookings, reviews, messages — all with RLS.
Seed SQL is at `artifacts/skillconnect/SETUP.sql` — run once in Supabase SQL Editor.
Seed account credentials are documented in comments inside SETUP.sql only.

**Why:** Supabase does not auto-create tables; the app silently returns empty results when tables don't exist.

**Schema alignment rule (critical):**
The TypeScript types in `src/types/database.ts` are the source of truth. SETUP.sql must match them exactly — never the other way round. Key column names to remember:
- `worker_details.availability_status` (NOT `availability`)
- `worker_details.daily_rate`, `worker_details.completed_jobs` — both exist in DB
- `jobs.skill` (NOT `category`)
- `jobs.budget_min`, `jobs.budget_max` (NOT `budget`)
- `jobs.preferred_date` — exists in DB
- `bookings.scheduled_date` (NOT `scheduled_at`)
- `bookings.scheduled_time`, `bookings.total_amount` (NOT `amount`)

**Key decisions:**
- Worker rating is updated by a Postgres trigger (`trg_update_worker_rating`) on reviews insert — no manual aggregation needed.
- `completed_jobs` is auto-incremented by `trg_booking_completed` trigger when booking status transitions to 'completed'.
- `signIn` in AuthContext eagerly fetches the profile role and returns it so LoginPage can navigate immediately without a setTimeout race.
- Search query removed `.gt('rating', 0)` — seed workers have explicit ratings set in SQL; that filter hid them all.
- Realtime chat uses `postgres_changes` filtered on `receiver_id=eq.<userId>`; sender side is optimistic-local (no wait for Supabase echo).
- `ChatPage.tsx` `.or()` must come AFTER `.select()` in supabase-js v2 query chains — TypeScript types don't accept it before select.
- `vite.config.ts` PORT and BASE_PATH are now optional (default to 3000 and '/') so Vercel builds work without those env vars being set at build time.
