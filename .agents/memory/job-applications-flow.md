---
name: job_applications accept flow
description: When customer accepts a job application — what DB writes happen and why
---

## Rule
Accepting a job application must atomically:
1. `job_applications` → status = 'accepted' for selected app
2. `bookings` → insert new row (job_id, customer_id, worker_id, status='accepted')
3. `jobs` → status = 'in_progress'
4. `job_applications` → status = 'rejected' for ALL other apps on same job_id

**Why:** Prevents double-booking the same job to multiple workers; keeps jobs table status consistent with bookings.

**How to apply:** MyJobsPage.tsx `handleDecision` function uses Promise.all for all 4 writes. The RLS policy `ja_update_customer` allows customers to update any application where they own the parent job.
