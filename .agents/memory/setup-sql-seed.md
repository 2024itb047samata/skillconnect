---
name: SETUP.sql seed strategy
description: How auth.users and profiles conflict resolution works in seed data
---

## Rule
- `auth.users` uses `ON CONFLICT (id) DO NOTHING` — UUIDs are fixed (pattern: 00000003-0000-0000-0000-0000000000XX)
- `public.profiles` uses `ON CONFLICT (id) DO UPDATE SET ...` — safe to re-run to update names/locations
- Changing emails for existing UUIDs in auth.users won't work on a DB that already ran setup; only the profile email column gets updated

**Why:** auth.users is Supabase-managed; we can insert but not cleanly update email there. Profile data is safe to update freely.

**How to apply:** When adding new seed users, add both an auth.users row AND a profiles row. Workers 1-50 UUIDs follow the 00000003 prefix pattern.
