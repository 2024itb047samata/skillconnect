-- ============================================================
-- SkillConnect — Complete Database Setup + Seed Data
-- Run this ONCE in your Supabase SQL Editor (supabase.com/dashboard → SQL Editor)
-- All existing tables/policies will be replaced cleanly.
--
-- ⚠️  DEMO ENVIRONMENT ONLY ⚠️
-- Seed accounts use a shared demo password ("SkillPass123").
-- DELETE all seeded auth.users rows before any public deployment.
-- ============================================================

-- ============================================================
-- 1. DROP TABLES (clean slate)
-- ============================================================
drop table if exists public.job_applications cascade;
drop table if exists public.messages cascade;
drop table if exists public.reviews cascade;
drop table if exists public.bookings cascade;
drop table if exists public.jobs cascade;
drop table if exists public.sos_reports cascade;
drop table if exists public.emergency_bookings cascade;
drop table if exists public.contractor_teams cascade;
drop table if exists public.worker_details cascade;
drop table if exists public.profiles cascade;

-- ============================================================
-- 2. TABLE DEFINITIONS
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'customer' check (role in ('customer', 'worker', 'admin', 'contractor')),
  phone text,
  location text,
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.worker_details (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  skills text[] not null default '{}',
  experience_years int not null default 0,
  hourly_rate numeric(10,2),
  daily_rate numeric(10,2),
  availability_status text not null default 'available' check (availability_status in ('available', 'busy', 'offline')),
  bio text,
  completed_jobs int not null default 0,
  rating numeric(3,2) not null default 0,
  total_reviews int not null default 0,
  skill_trust_score int not null default 70,
  ai_verification_status text not null default 'unverified',
  ai_confidence_rating numeric(5,2) not null default 0,
  total_earnings numeric(12,2) not null default 0,
  this_month_earnings numeric(12,2) not null default 0,
  response_time_minutes int not null default 60,
  repeat_customers int not null default 0,
  is_women_professional boolean not null default false,
  languages text[] not null default '{}',
  certifications text[] not null default '{}',
  portfolio_urls text[] not null default '{}',
  emergency_available boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  skill text not null,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  location text not null,
  preferred_date date,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  notes text,
  scheduled_date date,
  scheduled_time time,
  total_amount numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  constraint reviews_booking_customer_unique unique (booking_id, customer_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  cover_note text,
  created_at timestamptz not null default now(),
  constraint job_applications_unique unique (job_id, worker_id)
);

create table public.sos_reports (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.profiles(id) on delete cascade,
  report_type text not null check (report_type in ('non_payment', 'wage_dispute', 'unsafe_environment', 'harassment', 'other')),
  description text,
  location text,
  evidence_urls text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'investigating', 'resolved', 'dismissed')),
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.emergency_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid references public.profiles(id) on delete set null,
  emergency_type text not null,
  location text,
  description text,
  urgency_level text not null default 'high' check (urgency_level in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'assigned', 'in_progress', 'resolved', 'cancelled')),
  eta_minutes int,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.contractor_teams (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  site_name text,
  role text not null default 'worker',
  daily_wage numeric(10,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
create index idx_worker_details_user_id on public.worker_details(user_id);
create index idx_worker_details_rating on public.worker_details(rating desc);
create index idx_worker_details_availability on public.worker_details(availability_status);
create index idx_jobs_customer_id on public.jobs(customer_id);
create index idx_jobs_status on public.jobs(status);
create index idx_jobs_skill on public.jobs(skill);
create index idx_bookings_customer_id on public.bookings(customer_id);
create index idx_bookings_worker_id on public.bookings(worker_id);
create index idx_reviews_worker_id on public.reviews(worker_id);
create index idx_messages_sender on public.messages(sender_id);
create index idx_messages_receiver on public.messages(receiver_id);
create index idx_job_applications_job_id on public.job_applications(job_id);
create index idx_job_applications_worker_id on public.job_applications(worker_id);

-- ============================================================
-- 4. TRIGGERS
-- ============================================================

create or replace function public.update_worker_rating()
returns trigger language plpgsql security definer as $$
begin
  update public.worker_details
  set rating = coalesce((select round(avg(r.rating)::numeric, 2) from public.reviews r where r.worker_id = NEW.worker_id), 0),
      total_reviews = (select count(*) from public.reviews r where r.worker_id = NEW.worker_id)
  where user_id = NEW.worker_id;
  return NEW;
end; $$;

drop trigger if exists trg_update_worker_rating on public.reviews;
create trigger trg_update_worker_rating after insert on public.reviews for each row execute function public.update_worker_rating();

create or replace function public.handle_booking_completed()
returns trigger language plpgsql security definer as $$
begin
  if NEW.status = 'completed' and OLD.status <> 'completed' then
    update public.worker_details set completed_jobs = completed_jobs + 1 where user_id = NEW.worker_id;
  end if;
  return NEW;
end; $$;

drop trigger if exists trg_booking_completed on public.bookings;
create trigger trg_booking_completed after update on public.bookings for each row execute function public.handle_booking_completed();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, role, phone, location)
  values (NEW.id, NEW.email,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    coalesce(NEW.raw_user_meta_data ->> 'role', 'customer'),
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'location')
  on conflict (id) do nothing;
  return NEW;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.handle_worker_profile()
returns trigger language plpgsql security definer as $$
begin
  if NEW.role = 'worker' then
    insert into public.worker_details (user_id, skills)
    values (NEW.id, '{}')
    on conflict (user_id) do nothing;
  end if;
  return NEW;
end; $$;

drop trigger if exists trg_create_worker_details on public.profiles;
create trigger trg_create_worker_details after insert on public.profiles for each row execute function public.handle_worker_profile();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin NEW.updated_at = now(); return NEW; end; $$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists trg_worker_details_updated on public.worker_details;
create trigger trg_worker_details_updated before update on public.worker_details for each row execute function public.set_updated_at();
drop trigger if exists trg_jobs_updated on public.jobs;
create trigger trg_jobs_updated before update on public.jobs for each row execute function public.set_updated_at();
drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings for each row execute function public.set_updated_at();

-- ============================================================
-- 5. ROW-LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.worker_details enable row level security;
alter table public.jobs enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.job_applications enable row level security;
alter table public.sos_reports enable row level security;
alter table public.emergency_bookings enable row level security;
alter table public.contractor_teams enable row level security;

create policy "profiles_select_all"  on public.profiles for select using (true);
create policy "profiles_insert_own"  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles for update using (auth.uid() = id);
create policy "wd_select_all"        on public.worker_details for select using (true);
create policy "wd_insert_own"        on public.worker_details for insert with check (auth.uid() = user_id);
create policy "wd_update_own"        on public.worker_details for update using (auth.uid() = user_id);
create policy "jobs_select_all"      on public.jobs for select using (true);
create policy "jobs_insert_own"      on public.jobs for insert with check (auth.uid() = customer_id);
create policy "jobs_update_own"      on public.jobs for update using (auth.uid() = customer_id);
create policy "jobs_delete_own"      on public.jobs for delete using (auth.uid() = customer_id);
create policy "bookings_select"      on public.bookings for select using (auth.uid() = customer_id or auth.uid() = worker_id);
create policy "bookings_insert"      on public.bookings for insert with check (auth.uid() = customer_id);
create policy "bookings_update"      on public.bookings for update using (auth.uid() = customer_id or auth.uid() = worker_id);
create policy "reviews_select_all"   on public.reviews for select using (true);
create policy "reviews_insert_own"   on public.reviews for insert with check (auth.uid() = customer_id);
create policy "messages_select"      on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "messages_insert"      on public.messages for insert with check (auth.uid() = sender_id);
create policy "messages_update"      on public.messages for update using (auth.uid() = receiver_id);
-- job_applications: workers apply, customers/workers can read, customers update status
create policy "ja_select_worker"     on public.job_applications for select using (auth.uid() = worker_id or auth.uid() in (select customer_id from public.jobs where id = job_id));
create policy "ja_insert_worker"     on public.job_applications for insert with check (auth.uid() = worker_id);
create policy "ja_update_customer"   on public.job_applications for update using (auth.uid() in (select customer_id from public.jobs where id = job_id));
create policy "sos_select_own"       on public.sos_reports for select using (auth.uid() = worker_id);
create policy "sos_insert_own"       on public.sos_reports for insert with check (auth.uid() = worker_id);
create policy "emergency_select"     on public.emergency_bookings for select using (auth.uid() = customer_id or auth.uid() = worker_id);
create policy "emergency_insert"     on public.emergency_bookings for insert with check (auth.uid() = customer_id);
create policy "ct_select_own"        on public.contractor_teams for select using (auth.uid() = contractor_id or auth.uid() = worker_id);
create policy "ct_insert_own"        on public.contractor_teams for insert with check (auth.uid() = contractor_id);
create policy "ct_update_own"        on public.contractor_teams for update using (auth.uid() = contractor_id);

-- ============================================================
-- 6. REALTIME
-- ============================================================
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- 7. SEED DATA
-- 1 admin + 3 customers + 50 Indian workers
-- Password for ALL demo accounts: SkillPass123
-- ============================================================

do $$
declare
  v_pw text := '$2a$10$PJkpGPMBNGKU3lY0OSSmqOEfRsQ.Wr7LNGH8bOeNUcQFbVBkTFEC2';
  v_admin uuid := '00000001-0000-0000-0000-000000000001';
  v_c1 uuid := '00000002-0000-0000-0000-000000000001';
  v_c2 uuid := '00000002-0000-0000-0000-000000000002';
  v_c3 uuid := '00000002-0000-0000-0000-000000000003';
  -- Workers 1-10 (same UUIDs as before)
  v_w1  uuid := '00000003-0000-0000-0000-000000000001';
  v_w2  uuid := '00000003-0000-0000-0000-000000000002';
  v_w3  uuid := '00000003-0000-0000-0000-000000000003';
  v_w4  uuid := '00000003-0000-0000-0000-000000000004';
  v_w5  uuid := '00000003-0000-0000-0000-000000000005';
  v_w6  uuid := '00000003-0000-0000-0000-000000000006';
  v_w7  uuid := '00000003-0000-0000-0000-000000000007';
  v_w8  uuid := '00000003-0000-0000-0000-000000000008';
  v_w9  uuid := '00000003-0000-0000-0000-000000000009';
  v_w10 uuid := '00000003-0000-0000-0000-000000000010';
  -- Workers 11-20
  v_w11 uuid := '00000003-0000-0000-0000-000000000011';
  v_w12 uuid := '00000003-0000-0000-0000-000000000012';
  v_w13 uuid := '00000003-0000-0000-0000-000000000013';
  v_w14 uuid := '00000003-0000-0000-0000-000000000014';
  v_w15 uuid := '00000003-0000-0000-0000-000000000015';
  v_w16 uuid := '00000003-0000-0000-0000-000000000016';
  v_w17 uuid := '00000003-0000-0000-0000-000000000017';
  v_w18 uuid := '00000003-0000-0000-0000-000000000018';
  v_w19 uuid := '00000003-0000-0000-0000-000000000019';
  v_w20 uuid := '00000003-0000-0000-0000-000000000020';
  -- Workers 21-30
  v_w21 uuid := '00000003-0000-0000-0000-000000000021';
  v_w22 uuid := '00000003-0000-0000-0000-000000000022';
  v_w23 uuid := '00000003-0000-0000-0000-000000000023';
  v_w24 uuid := '00000003-0000-0000-0000-000000000024';
  v_w25 uuid := '00000003-0000-0000-0000-000000000025';
  v_w26 uuid := '00000003-0000-0000-0000-000000000026';
  v_w27 uuid := '00000003-0000-0000-0000-000000000027';
  v_w28 uuid := '00000003-0000-0000-0000-000000000028';
  v_w29 uuid := '00000003-0000-0000-0000-000000000029';
  v_w30 uuid := '00000003-0000-0000-0000-000000000030';
  -- Workers 31-40
  v_w31 uuid := '00000003-0000-0000-0000-000000000031';
  v_w32 uuid := '00000003-0000-0000-0000-000000000032';
  v_w33 uuid := '00000003-0000-0000-0000-000000000033';
  v_w34 uuid := '00000003-0000-0000-0000-000000000034';
  v_w35 uuid := '00000003-0000-0000-0000-000000000035';
  v_w36 uuid := '00000003-0000-0000-0000-000000000036';
  v_w37 uuid := '00000003-0000-0000-0000-000000000037';
  v_w38 uuid := '00000003-0000-0000-0000-000000000038';
  v_w39 uuid := '00000003-0000-0000-0000-000000000039';
  v_w40 uuid := '00000003-0000-0000-0000-000000000040';
  -- Workers 41-50
  v_w41 uuid := '00000003-0000-0000-0000-000000000041';
  v_w42 uuid := '00000003-0000-0000-0000-000000000042';
  v_w43 uuid := '00000003-0000-0000-0000-000000000043';
  v_w44 uuid := '00000003-0000-0000-0000-000000000044';
  v_w45 uuid := '00000003-0000-0000-0000-000000000045';
  v_w46 uuid := '00000003-0000-0000-0000-000000000046';
  v_w47 uuid := '00000003-0000-0000-0000-000000000047';
  v_w48 uuid := '00000003-0000-0000-0000-000000000048';
  v_w49 uuid := '00000003-0000-0000-0000-000000000049';
  v_w50 uuid := '00000003-0000-0000-0000-000000000050';
  v_ii  text := '00000000-0000-0000-0000-000000000000';
  v_ap  text := '{"provider":"email","providers":["email"]}';
begin

  -- ── Auth users ─────────────────────────────────────────────────────────────
  insert into auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token)
  values
    (v_ii,v_admin,'authenticated','authenticated','admin@skillconnect.app',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_c1,'authenticated','authenticated','neha.agarwal@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_c2,'authenticated','authenticated','arjun.mehta@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_c3,'authenticated','authenticated','priya@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    -- Workers 1-10
    (v_ii,v_w1,'authenticated','authenticated','rajesh.plumber@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w2,'authenticated','authenticated','priya.electrician@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w3,'authenticated','authenticated','suresh.painter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w4,'authenticated','authenticated','amit.mason@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w5,'authenticated','authenticated','kavya.carpenter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w6,'authenticated','authenticated','vikram.mechanic@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w7,'authenticated','authenticated','sunita.housekeeper@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w8,'authenticated','authenticated','mohammed.ac@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w9,'authenticated','authenticated','divya.electrician@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w10,'authenticated','authenticated','ramesh.plumber@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    -- Workers 11-20
    (v_ii,v_w11,'authenticated','authenticated','arjun.electrician@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w12,'authenticated','authenticated','ravi.electrician@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w13,'authenticated','authenticated','keerthana.electrician@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w14,'authenticated','authenticated','sunil.electrician@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w15,'authenticated','authenticated','mohan.plumber@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w16,'authenticated','authenticated','arun.plumber@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w17,'authenticated','authenticated','santosh.plumber@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w18,'authenticated','authenticated','vikas.plumber@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w19,'authenticated','authenticated','hemant.carpenter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w20,'authenticated','authenticated','dinesh.carpenter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    -- Workers 21-30
    (v_ii,v_w21,'authenticated','authenticated','shiva.carpenter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w22,'authenticated','authenticated','anita.carpenter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w23,'authenticated','authenticated','manoj.painter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w24,'authenticated','authenticated','ganesh.painter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w25,'authenticated','authenticated','pushpa.painter@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w26,'authenticated','authenticated','lakshmi.housekeeper@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w27,'authenticated','authenticated','seema.housekeeper@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w28,'authenticated','authenticated','radha.housekeeper@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w29,'authenticated','authenticated','fatima.housekeeper@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w30,'authenticated','authenticated','aakash.ac@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    -- Workers 31-40
    (v_ii,v_w31,'authenticated','authenticated','sivakumar.ac@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w32,'authenticated','authenticated','roshan.ac@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w33,'authenticated','authenticated','praveen.ac@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w34,'authenticated','authenticated','nitin.cctv@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w35,'authenticated','authenticated','harish.cctv@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w36,'authenticated','authenticated','irfan.cctv@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w37,'authenticated','authenticated','satish.cctv@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w38,'authenticated','authenticated','ramu.driver@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w39,'authenticated','authenticated','kamlesh.driver@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w40,'authenticated','authenticated','bablu.driver@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    -- Workers 41-50
    (v_ii,v_w41,'authenticated','authenticated','manohar.driver@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w42,'authenticated','authenticated','rohit.delivery@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w43,'authenticated','authenticated','vinod.delivery@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w44,'authenticated','authenticated','ajay.delivery@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w45,'authenticated','authenticated','savitri.caretaker@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w46,'authenticated','authenticated','meena.caretaker@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w47,'authenticated','authenticated','deepak.plumber@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w48,'authenticated','authenticated','sanjay.mason@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w49,'authenticated','authenticated','abdul.electrician@example.com',v_pw,now(),v_ap,'{}',now(),now(),'',''),
    (v_ii,v_w50,'authenticated','authenticated','preethi.housekeeper@example.com',v_pw,now(),v_ap,'{}',now(),now(),'','')
  on conflict (id) do nothing;

  -- ── Profiles ───────────────────────────────────────────────────────────────
  insert into public.profiles (id, email, full_name, role, phone, location, is_verified)
  values
    (v_admin,'admin@skillconnect.app',      'Admin User',          'admin',    '+91-99000-00001','New Delhi',        true),
    (v_c1,  'neha.agarwal@example.com',     'Neha Agarwal',        'customer', '+91-98300-10001','Kolkata',          false),
    (v_c2,  'arjun.mehta@example.com',      'Arjun Mehta',         'customer', '+91-98300-10002','Bengaluru',        false),
    (v_c3,  'priya@example.com',            'Priya Patel',         'customer', '+91-98300-10003','Mumbai',           false),
    -- Workers 1-10
    (v_w1,  'rajesh.plumber@example.com',   'Rajesh Kumar',        'worker',   '+91-70001-20001','Kolkata, WB',      true),
    (v_w2,  'priya.electrician@example.com','Priya Sharma',        'worker',   '+91-70001-20002','Mumbai, MH',       true),
    (v_w3,  'suresh.painter@example.com',   'Suresh Yadav',        'worker',   '+91-70001-20003','Delhi',            true),
    (v_w4,  'amit.mason@example.com',       'Amit Patel',          'worker',   '+91-70001-20004','Ahmedabad, GJ',    true),
    (v_w5,  'kavya.carpenter@example.com',  'Kavya Reddy',         'worker',   '+91-70001-20005','Bengaluru, KA',    true),
    (v_w6,  'vikram.mechanic@example.com',  'Vikram Singh',        'worker',   '+91-70001-20006','Pune, MH',         false),
    (v_w7,  'sunita.housekeeper@example.com','Sunita Devi',        'worker',   '+91-70001-20007','Chennai, TN',      true),
    (v_w8,  'mohammed.ac@example.com',      'Mohammed Ali',        'worker',   '+91-70001-20008','Hyderabad, TS',    true),
    (v_w9,  'divya.electrician@example.com','Divya Nair',          'worker',   '+91-70001-20009','Kochi, KL',        false),
    (v_w10, 'ramesh.plumber@example.com',   'Ramesh Gupta',        'worker',   '+91-70001-20010','Varanasi, UP',     true),
    -- Workers 11-20
    (v_w11, 'arjun.electrician@example.com','Arjun Roy',           'worker',   '+91-70001-20011','Kolkata, WB',      true),
    (v_w12, 'ravi.electrician@example.com', 'Ravi Shankar',        'worker',   '+91-70001-20012','Chennai, TN',      true),
    (v_w13, 'keerthana.electrician@example.com','Keerthana M',     'worker',   '+91-70001-20013','Bengaluru, KA',    true),
    (v_w14, 'sunil.electrician@example.com','Sunil Mehta',         'worker',   '+91-70001-20014','Pune, MH',         true),
    (v_w15, 'mohan.plumber@example.com',    'Mohan Das',           'worker',   '+91-70001-20015','Howrah, WB',       false),
    (v_w16, 'arun.plumber@example.com',     'Arun Sharma',         'worker',   '+91-70001-20016','Delhi',            true),
    (v_w17, 'santosh.plumber@example.com',  'Santosh Kumar',       'worker',   '+91-70001-20017','Chennai, TN',      false),
    (v_w18, 'vikas.plumber@example.com',    'Vikas Yadav',         'worker',   '+91-70001-20018','Lucknow, UP',      false),
    (v_w19, 'hemant.carpenter@example.com', 'Hemant Patil',        'worker',   '+91-70001-20019','Pune, MH',         true),
    (v_w20, 'dinesh.carpenter@example.com', 'Dinesh Kumar',        'worker',   '+91-70001-20020','Jaipur, RJ',       false),
    -- Workers 21-30
    (v_w21, 'shiva.carpenter@example.com',  'Shiva Prakash',       'worker',   '+91-70001-20021','Hyderabad, TS',    true),
    (v_w22, 'anita.carpenter@example.com',  'Anita Kumari',        'worker',   '+91-70001-20022','Delhi',            false),
    (v_w23, 'manoj.painter@example.com',    'Manoj Kumar',         'worker',   '+91-70001-20023','Mumbai, MH',       true),
    (v_w24, 'ganesh.painter@example.com',   'Ganesh Raj',          'worker',   '+91-70001-20024','Chennai, TN',      false),
    (v_w25, 'pushpa.painter@example.com',   'Pushpa Devi',         'worker',   '+91-70001-20025','Jaipur, RJ',       false),
    (v_w26, 'lakshmi.housekeeper@example.com','Lakshmi Bai',       'worker',   '+91-70001-20026','Bengaluru, KA',    true),
    (v_w27, 'seema.housekeeper@example.com','Seema Rani',          'worker',   '+91-70001-20027','Mumbai, MH',       false),
    (v_w28, 'radha.housekeeper@example.com','Radha Kumari',        'worker',   '+91-70001-20028','Kolkata, WB',      true),
    (v_w29, 'fatima.housekeeper@example.com','Fatima Begum',       'worker',   '+91-70001-20029','Hyderabad, TS',    false),
    (v_w30, 'aakash.ac@example.com',        'Aakash Verma',        'worker',   '+91-70001-20030','Delhi',            true),
    -- Workers 31-40
    (v_w31, 'sivakumar.ac@example.com',     'Sivakumar T',         'worker',   '+91-70001-20031','Chennai, TN',      true),
    (v_w32, 'roshan.ac@example.com',        'Roshan Kumar',        'worker',   '+91-70001-20032','Mumbai, MH',       true),
    (v_w33, 'praveen.ac@example.com',       'Praveen S',           'worker',   '+91-70001-20033','Bengaluru, KA',    false),
    (v_w34, 'nitin.cctv@example.com',       'Nitin Gupta',         'worker',   '+91-70001-20034','Delhi',            true),
    (v_w35, 'harish.cctv@example.com',      'Harish Kumar',        'worker',   '+91-70001-20035','Bengaluru, KA',    false),
    (v_w36, 'irfan.cctv@example.com',       'Irfan Khan',          'worker',   '+91-70001-20036','Mumbai, MH',       true),
    (v_w37, 'satish.cctv@example.com',      'Satish Babu',         'worker',   '+91-70001-20037','Hyderabad, TS',    false),
    (v_w38, 'ramu.driver@example.com',      'Ramu Prasad',         'worker',   '+91-70001-20038','Kolkata, WB',      false),
    (v_w39, 'kamlesh.driver@example.com',   'Kamlesh Verma',       'worker',   '+91-70001-20039','Delhi',            true),
    (v_w40, 'bablu.driver@example.com',     'Bablu Kumar',         'worker',   '+91-70001-20040','Mumbai, MH',       false),
    -- Workers 41-50
    (v_w41, 'manohar.driver@example.com',   'Manohar Singh',       'worker',   '+91-70001-20041','Pune, MH',         false),
    (v_w42, 'rohit.delivery@example.com',   'Rohit Kumar',         'worker',   '+91-70001-20042','Bengaluru, KA',    false),
    (v_w43, 'vinod.delivery@example.com',   'Vinod Yadav',         'worker',   '+91-70001-20043','Hyderabad, TS',    false),
    (v_w44, 'ajay.delivery@example.com',    'Ajay Singh',          'worker',   '+91-70001-20044','Delhi',            false),
    (v_w45, 'savitri.caretaker@example.com','Savitri Devi',        'worker',   '+91-70001-20045','Chennai, TN',      true),
    (v_w46, 'meena.caretaker@example.com',  'Meena Bai',           'worker',   '+91-70001-20046','Pune, MH',         false),
    (v_w47, 'deepak.plumber@example.com',   'Deepak Jha',          'worker',   '+91-70001-20047','Patna, BR',        false),
    (v_w48, 'sanjay.mason@example.com',     'Sanjay Tiwari',       'worker',   '+91-70001-20048','Bhopal, MP',       true),
    (v_w49, 'abdul.electrician@example.com','Abdul Karim',         'worker',   '+91-70001-20049','Hyderabad, TS',    true),
    (v_w50, 'preethi.housekeeper@example.com','Preethi Krishnan',  'worker',   '+91-70001-20050','Coimbatore, TN',   false)
  on conflict (id) do update set
    full_name=excluded.full_name, role=excluded.role, phone=excluded.phone,
    location=excluded.location, is_verified=excluded.is_verified, email=excluded.email;

  -- ── Worker Details ─────────────────────────────────────────────────────────
  insert into public.worker_details
    (user_id, skills, experience_years, hourly_rate, daily_rate,
     bio, availability_status, rating, total_reviews, completed_jobs,
     skill_trust_score, languages, emergency_available)
  values
    -- 1-10
    (v_w1,  array['Plumber','Pipe Fitting','Drain Cleaning'],       8,350,1800,'Expert plumber with 8 years in Kolkata. Available for emergency call-outs.','available',4.8,42,38,92,array['Hindi','Bengali'],true),
    (v_w2,  array['Electrician','Wiring','Panel Upgrade'],         12,500,2500,'Licensed electrician covering all of Mumbai — residential and commercial.','available',4.9,67,61,96,array['Hindi','Marathi'],false),
    (v_w3,  array['Painter','Interior Painting','Exterior Painting'], 6,280,1400,'Crisp, clean finishes every time. Interior and exterior specialist in Delhi.','available',4.6,31,27,88,array['Hindi'],false),
    (v_w4,  array['Mason','Bricklaying','Tiling','Concrete'],      15,350,1750,'Master mason with 15 years in Ahmedabad. Bricklaying, tiling, stonework.','busy',4.7,58,54,91,array['Hindi','Gujarati'],false),
    (v_w5,  array['Carpenter','Cabinetry','Flooring','Furniture'],  9,400,2000,'Skilled carpenter in Bengaluru. Custom cabinets, hardwood floors, furniture.','available',4.8,39,35,90,array['English','Kannada'],false),
    (v_w6,  array['Mechanic','Auto Repair','Oil Change'],          11,450,2250,'ASE-certified mobile mechanic in Pune. Diagnostics, brakes, full service.','available',4.4,25,22,82,array['Hindi','Marathi'],false),
    (v_w7,  array['Housekeeper','Deep Cleaning','Move-out Cleaning'], 5,200,1000,'Detail-oriented cleaning professional in Chennai. Eco-friendly products.','available',4.9,85,80,94,array['Tamil','English'],false),
    (v_w8,  array['AC Technician','HVAC','Refrigeration'],          7,600,3000,'HVAC specialist in Hyderabad. Installations, repairs, seasonal tune-ups.','available',4.7,48,44,89,array['Urdu','Telugu','Hindi'],true),
    (v_w9,  array['Electrician','Lighting','Smart Home'],           4,450,2250,'Electrician specializing in smart home automation and lighting design.','available',4.3,15,13,78,array['Malayalam','English'],false),
    (v_w10, array['Plumber','Water Heater','Gas Lines'],           20,500,2500,'Senior plumber, 20 years experience. Bathroom remodels and gas line work.','available',4.9,112,105,97,array['Hindi'],true),
    -- 11-20
    (v_w11, array['Electrician','Wiring','Solar Installation'],     9,460,2300,'Electrician in Kolkata with expertise in solar panel installation.','available',4.8,36,32,90,array['Bengali','Hindi'],false),
    (v_w12, array['Electrician','Panel Upgrade','Generator'],      14,490,2450,'Senior electrician in Chennai — industrial and residential panel work.','available',4.9,78,72,95,array['Tamil','English'],false),
    (v_w13, array['Electrician','Wiring','Home Automation'],        7,500,2500,'Bengaluru electrician focused on smart home and EV charger installation.','available',4.7,29,26,86,array['Kannada','English'],false),
    (v_w14, array['Electrician','Wiring','Circuit Breaker'],       15,520,2600,'Licensed master electrician in Pune — 15 years, no job too big.','busy',5.0,93,87,98,array['Marathi','Hindi'],false),
    (v_w15, array['Plumber','Pipe Fitting','Bathroom Remodel'],     6,320,1600,'Plumber in Howrah covering all residential pipe and fitting work.','available',4.6,28,24,85,array['Bengali','Hindi'],false),
    (v_w16, array['Plumber','Drain Cleaning','Sewer Repair'],      10,400,2000,'Delhi plumber specializing in sewer lines and drain unblocking.','available',4.7,51,47,89,array['Hindi'],false),
    (v_w17, array['Plumber','Water Heater','Pipe Fitting'],         7,350,1750,'Chennai plumber for water heaters, overhead tanks, and pipe work.','available',4.5,33,30,84,array['Tamil','Hindi'],false),
    (v_w18, array['Plumber','Drain Cleaning'],                      5,280,1400,'Plumber in Lucknow — fast drain cleaning and pipe repair.','available',4.3,19,17,80,array['Hindi'],false),
    (v_w19, array['Carpenter','Cabinetry','Modular Kitchen'],       7,380,1900,'Modular kitchen specialist in Pune. Quality finishes, on-time delivery.','available',4.6,34,31,87,array['Marathi','Hindi'],false),
    (v_w20, array['Carpenter','Flooring','Furniture'],              5,360,1800,'Carpenter in Jaipur — hardwood flooring and custom furniture.','available',4.4,22,19,81,array['Hindi','Rajasthani'],false),
    -- 21-30
    (v_w21, array['Carpenter','Cabinetry','Doors','Windows'],       8,390,1950,'Hyderabad carpenter with expertise in doors, windows, and built-ins.','available',4.7,41,37,88,array['Telugu','Hindi'],false),
    (v_w22, array['Carpenter','Furniture','Flooring'],              6,410,2050,'Female carpenter in Delhi. Custom furniture and interior woodwork.','available',4.5,18,15,82,array['Hindi','Punjabi'],false),
    (v_w23, array['Painter','Interior Painting','Texture Work'],    8,300,1500,'Painter in Mumbai specializing in texture finishes and wallpaper.','available',4.7,45,41,89,array['Hindi','Marathi'],false),
    (v_w24, array['Painter','Exterior Painting','Waterproofing'],   5,260,1300,'Chennai painter with waterproofing expertise for terraces and walls.','available',4.4,21,19,80,array['Tamil'],false),
    (v_w25, array['Painter','Interior Painting','Stencil Work'],    4,250,1250,'Jaipur painter known for stencil patterns and vibrant colour work.','available',4.2,14,12,76,array['Hindi','Rajasthani'],false),
    (v_w26, array['Housekeeper','Deep Cleaning','Laundry'],         8,180,900,'Experienced housekeeper in Bengaluru — thorough, reliable, trusted.','available',4.8,72,68,93,array['Kannada','Tamil'],false),
    (v_w27, array['Housekeeper','Deep Cleaning','Office Cleaning'], 6,190,950,'Mumbai housekeeper covering residential and small office cleaning.','available',4.7,48,44,88,array['Hindi','Marathi'],false),
    (v_w28, array['Housekeeper','Move-out Cleaning','Deep Cleaning'],4,170,850,'Housekeeper in Kolkata — move-out specialist, 5-star results.','available',4.5,25,23,83,array['Bengali','Hindi'],false),
    (v_w29, array['Housekeeper','Deep Cleaning','Cooking'],         7,185,925,'Hyderabad housekeeper also offering cooking and daily meal prep.','available',4.8,56,51,91,array['Urdu','Telugu'],false),
    (v_w30, array['AC Technician','HVAC','Gas Refilling'],          5,580,2900,'AC technician in Delhi — all brands, gas refill, annual service.','available',4.5,27,24,83,array['Hindi'],false),
    -- 31-40
    (v_w31, array['AC Technician','HVAC','Ductwork'],              10,560,2800,'Senior HVAC technician in Chennai — 10 years, commercial and home AC.','available',4.8,61,57,92,array['Tamil','English'],false),
    (v_w32, array['AC Technician','HVAC','Refrigeration'],          8,620,3100,'Mumbai AC technician covering all major brands with quick turnaround.','available',4.9,53,49,94,array['Hindi','Marathi'],true),
    (v_w33, array['AC Technician','HVAC','Split AC'],               6,590,2950,'Bengaluru HVAC expert specializing in split ACs and VRF systems.','available',4.6,31,28,85,array['Kannada','English'],false),
    (v_w34, array['CCTV Technician','IP Cameras','DVR Setup'],      6,500,2500,'Delhi CCTV installer — home security, IP cameras, remote monitoring.','available',4.5,29,26,84,array['Hindi'],false),
    (v_w35, array['CCTV Technician','IP Cameras','Network'],        4,480,2400,'Bengaluru CCTV tech for homes, shops, and apartment complexes.','available',4.4,17,14,79,array['Kannada','English'],false),
    (v_w36, array['CCTV Technician','DVR Setup','Access Control'],  8,520,2600,'Mumbai security systems expert — CCTV, access control, intercom.','available',4.7,44,40,88,array['Hindi','Marathi'],false),
    (v_w37, array['CCTV Technician','IP Cameras','DVR Setup'],      5,490,2450,'Hyderabad CCTV installer — budget and premium camera systems.','available',4.5,22,19,82,array['Telugu','Urdu'],false),
    (v_w38, array['Driver','Chauffeur','Outstation Trips'],         7,300,1500,'Experienced driver in Kolkata — daily commute and outstation trips.','available',4.6,38,34,86,array['Bengali','Hindi'],false),
    (v_w39, array['Driver','Chauffeur','Airport Pickup'],          10,280,1400,'Delhi driver — airport transfers, corporate transport, safe and reliable.','available',4.7,59,55,89,array['Hindi','Punjabi'],false),
    (v_w40, array['Driver','Delivery','Outstation Trips'],          5,320,1600,'Mumbai driver available for city travel and intercity trips.','available',4.4,24,21,80,array['Hindi','Marathi'],false),
    -- 41-50
    (v_w41, array['Driver','Chauffeur','Wedding Driver'],           8,290,1450,'Pune driver specializing in wedding and event transport.','available',4.6,42,38,85,array['Marathi','Hindi'],false),
    (v_w42, array['Delivery Worker','Last Mile','E-commerce'],      2,200,1000,'Quick last-mile delivery worker in Bengaluru — bike and two-wheeler.','available',4.3,61,56,75,array['Kannada','English'],false),
    (v_w43, array['Delivery Worker','Last Mile','Courier'],         3,180,900,'Hyderabad delivery rider — reliable, on-time for parcels and food.','available',4.2,44,40,73,array['Telugu','Hindi'],false),
    (v_w44, array['Delivery Worker','Courier','Grocery Delivery'],  4,190,950,'Delhi delivery worker — grocery, medicine, and document courier.','available',4.4,78,73,78,array['Hindi'],false),
    (v_w45, array['Caretaker','Elder Care','Patient Care'],         6,220,1100,'Trained caretaker in Chennai — elder care, post-surgery recovery.','available',4.7,32,29,88,array['Tamil','English'],false),
    (v_w46, array['Caretaker','Child Care','Elder Care'],           4,200,1000,'Caretaker in Pune offering child and elder care with full patience.','available',4.5,19,17,82,array['Marathi','Hindi'],false),
    (v_w47, array['Plumber','Pipe Fitting','Sanitation'],           4,260,1300,'Plumber in Patna for all household pipe work and sanitation repairs.','available',4.2,16,14,77,array['Hindi','Bhojpuri'],false),
    (v_w48, array['Mason','Tiling','Flooring','Concrete'],          9,320,1600,'Mason in Bhopal — tile laying, flooring, and concrete finishing.','available',4.6,47,43,87,array['Hindi'],true),
    (v_w49, array['Electrician','Wiring','Industrial','Panels'],   11,470,2350,'Industrial electrician in Hyderabad — factory and commercial setups.','available',4.8,64,59,93,array['Urdu','Telugu','Hindi'],false),
    (v_w50, array['Housekeeper','Deep Cleaning','Cooking'],         5,175,875,'Housekeeper in Coimbatore also offering traditional South Indian cooking.','available',4.6,28,25,84,array['Tamil','English'],false)
  on conflict (user_id) do update set
    skills=excluded.skills, experience_years=excluded.experience_years,
    hourly_rate=excluded.hourly_rate, daily_rate=excluded.daily_rate,
    bio=excluded.bio, availability_status=excluded.availability_status,
    rating=excluded.rating, total_reviews=excluded.total_reviews,
    completed_jobs=excluded.completed_jobs, skill_trust_score=excluded.skill_trust_score,
    languages=excluded.languages, emergency_available=excluded.emergency_available;

  -- ── Sample Jobs ────────────────────────────────────────────────────────────
  insert into public.jobs (id, customer_id, title, description, skill, budget_min, budget_max, location, status, created_at)
  values
    ('10000001-0000-0000-0000-000000000001',v_c1,'Fix leaking kitchen pipe','Kitchen pipe under sink has been dripping for two weeks, need urgent fix.','Plumber',800,1500,'Salt Lake, Kolkata','open',now()-interval'2 days'),
    ('10000001-0000-0000-0000-000000000002',v_c2,'Install ceiling fan with light','Need a new ceiling fan with LED light kit installed in master bedroom.','Electrician',1200,2000,'Indiranagar, Bengaluru','in_progress',now()-interval'5 days'),
    ('10000001-0000-0000-0000-000000000003',v_c3,'Paint living room and bedroom','Two rooms, two coats, light colour scheme. Walls only.','Painter',4000,7000,'Andheri West, Mumbai','completed',now()-interval'10 days'),
    ('10000001-0000-0000-0000-000000000004',v_c1,'Deep clean 3BHK flat before move-out','Full deep clean including kitchen, bathrooms, and all rooms.','Housekeeper',2000,3500,'Park Street, Kolkata','open',now()-interval'1 day'),
    ('10000001-0000-0000-0000-000000000005',v_c2,'AC servicing and gas refill','Split AC not cooling properly, needs full service and gas top-up.','AC Technician',1500,3000,'Koramangala, Bengaluru','open',now()),
    ('10000001-0000-0000-0000-000000000006',v_c3,'CCTV installation — 4 cameras','Need 4 HD cameras installed with DVR and remote access at residence.','CCTV Technician',8000,15000,'Powai, Mumbai','open',now()-interval'3 hours'),
    ('10000001-0000-0000-0000-000000000007',v_c1,'Modular kitchen carpentry work','Need custom modular kitchen cabinets with soft-close drawers.','Carpenter',15000,30000,'New Town, Kolkata','open',now()-interval'4 hours'),
    ('10000001-0000-0000-0000-000000000008',v_c2,'Bathroom tiling — complete remodel','Remove old tiles, lay new 2x2 ft tiles in bathroom floor and walls.','Mason',12000,22000,'Whitefield, Bengaluru','open',now()-interval'6 hours'),
    ('10000001-0000-0000-0000-000000000009',v_c3,'Daily driver needed for 1 month','Need a reliable daily driver Mon-Sat, 8am-7pm for office commute.','Driver',20000,28000,'Bandra, Mumbai','open',now()-interval'1 day'),
    ('10000001-0000-0000-0000-000000000010',v_c1,'Elder care for senior parent','Need a patient caretaker for elderly parent during the daytime.','Caretaker',15000,22000,'Ballygunge, Kolkata','open',now()-interval'2 hours')
  on conflict (id) do nothing;

  -- ── Sample Bookings ─────────────────────────────────────────────────────────
  insert into public.bookings (id, job_id, customer_id, worker_id, status, notes, scheduled_date, total_amount, created_at)
  values
    ('20000001-0000-0000-0000-000000000001','10000001-0000-0000-0000-000000000002',v_c2,v_w2,'completed','Please bring all necessary tools.',now()::date-4,1600.00,now()-interval'5 days'),
    ('20000001-0000-0000-0000-000000000002','10000001-0000-0000-0000-000000000003',v_c3,v_w3,'completed','Water-based paint preferred, two coats.',now()::date-9,5500.00,now()-interval'10 days'),
    ('20000001-0000-0000-0000-000000000003','10000001-0000-0000-0000-000000000001',v_c1,v_w1,'pending','Need same-day if possible.',now()::date+1,1200.00,now()-interval'1 day')
  on conflict (id) do nothing;

  -- ── Sample Reviews ──────────────────────────────────────────────────────────
  insert into public.reviews (booking_id, customer_id, worker_id, rating, comment, created_at)
  values
    ('20000001-0000-0000-0000-000000000001',v_c2,v_w2,5,'Priya was fantastic — on time, professional, and the fan looks great!',now()-interval'3 days'),
    ('20000001-0000-0000-0000-000000000002',v_c3,v_w3,5,'Suresh did an outstanding job. Very neat, clean, and on schedule.',now()-interval'8 days')
  on conflict (booking_id, customer_id) do nothing;

  -- ── Sample Messages ─────────────────────────────────────────────────────────
  insert into public.messages (sender_id, receiver_id, content, created_at)
  values
    (v_c1,v_w1,'Hi Rajesh, are you available this weekend to fix my pipe?',now()-interval'2 hours'),
    (v_w1,v_c1,'Hello Neha! Yes, I can come Saturday morning. 9am works?',now()-interval'1 hour 45 minutes'),
    (v_c1,v_w1,'Perfect, 9am Saturday works great. Thank you!',now()-interval'1 hour 30 minutes'),
    (v_c2,v_w2,'Priya, loved the fan installation. Can you also help with outdoor lighting?',now()-interval'3 days'),
    (v_w2,v_c2,'Thanks Arjun! Absolutely — I can quote outdoor lighting. Want me to visit?',now()-interval'2 days 22 hours')
  on conflict do nothing;

end $$;
