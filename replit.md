# SkillConnect

A digital labour marketplace connecting customers with verified skilled tradespeople (plumbers, electricians, painters, etc.) featuring real-time chat, booking management, worker profiles, and an admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/skillconnect run dev` — run the frontend (port 18779)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000 / 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase project credentials

## One-time Database Setup

1. Go to your [Supabase dashboard](https://supabase.com) → SQL Editor
2. Paste and run `artifacts/skillconnect/SETUP.sql`
3. This creates all tables, RLS policies, indexes, triggers, and seeds 14 demo accounts

**Seed account password:** `SkillPass123` *(demo/development only — remove seed accounts before any public deployment)*

| Email | Role |
|---|---|
| admin@skillconnect.app | Admin |
| sarah@example.com | Customer |
| james@example.com | Customer |
| mike.plumber@example.com | Worker (Plumber) |
| ana.electrician@example.com | Worker (Electrician) |
| nina.cleaner@example.com | Worker (Cleaner) |
| ... (10 workers total) | Worker |

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite + Tailwind CSS v3 + Framer Motion
- Backend: Supabase (Auth, PostgreSQL, Realtime)
- Routing: react-router-dom (BrowserRouter, basename from BASE_URL)

## Where things live

- `artifacts/skillconnect/src/pages/` — all page components (role-based folders)
- `artifacts/skillconnect/src/contexts/AuthContext.tsx` — auth + profile state
- `artifacts/skillconnect/src/lib/supabase.ts` — Supabase client
- `artifacts/skillconnect/src/types/database.ts` — all TypeScript types
- `artifacts/skillconnect/SETUP.sql` — complete DB migration + seed data

## Architecture decisions

- Supabase RLS enforces row-level access: customers see only their bookings, workers see only bookings they're part of, messages are sender/receiver scoped.
- Worker rating is auto-computed by a Postgres trigger (`trg_update_worker_rating`) whenever a review is inserted — no manual aggregation needed.
- Realtime chat uses `supabase.channel` with `postgres_changes` filtering on `receiver_id=eq.<userId>` for push delivery; sender side is optimistic-local (no wait for Supabase echo).
- The `signIn` function in AuthContext eagerly fetches the profile role so `LoginPage` can navigate immediately to the correct dashboard without a setTimeout race.

## Product

- **Landing page** — service category browser, SkillTrust score explainer, CTAs for workers and customers
- **Search workers** — filterable by name and skill, sorted by rating
- **Worker profile** — full bio, skills, rating, reviews, booking button
- **Customer dashboard** — featured workers, quick actions (Post Job, Bookings, Chat)
- **Worker dashboard** — active bookings, reviews, earnings, profile edit
- **Real-time chat** — persistent conversations with unread badges and push via Supabase Realtime
- **Bookings** — status lifecycle (pending → accepted → in_progress → completed), leave review flow
- **Admin dashboard** — stats overview, user verification, worker management

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `SETUP.sql` in Supabase SQL Editor before testing — tables do not exist on a fresh Supabase project.
- The `availability_status` column was removed from the `fetchWorkers` query; the DB schema uses `availability` (text field, values: `available`/`busy`/`unavailable`).
- Seed auth users use a pre-hashed bcrypt password (`SkillPass123`). New users created via signup go through the normal Supabase email confirmation flow.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
