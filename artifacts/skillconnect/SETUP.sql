-- ============================================================
-- SkillConnect — Complete Database Setup + Seed Data
-- Run this ONCE in your Supabase SQL Editor (supabase.com/dashboard → SQL Editor)
-- All existing tables/policies will be replaced cleanly.
--
-- ⚠️  DEMO ENVIRONMENT ONLY ⚠️
-- The seed block below creates demo accounts with a shared password
-- ("SkillPass123") for local development and testing purposes ONLY.
-- BEFORE any public or production deployment you MUST:
--   1. Delete or disable all seeded auth.users rows
--   2. Change or remove the seed block entirely
--   3. Create real admin accounts with strong, unique passwords
-- ============================================================

-- ============================================================
-- 1. DROP ALL TABLES (clean slate, reverse dependency order)
-- ============================================================

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
-- 2. TABLE DEFINITIONS (aligned with TypeScript types)
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
  ai_verification_status text not null default 'unverified' check (ai_verification_status in ('unverified', 'pending', 'verified', 'rejected')),
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
create index idx_bookings_status on public.bookings(status);
create index idx_reviews_worker_id on public.reviews(worker_id);
create index idx_messages_sender on public.messages(sender_id);
create index idx_messages_receiver on public.messages(receiver_id);
create index idx_messages_thread on public.messages(sender_id, receiver_id, created_at);
create index idx_sos_reports_worker_id on public.sos_reports(worker_id);
create index idx_emergency_bookings_customer_id on public.emergency_bookings(customer_id);
create index idx_contractor_teams_contractor_id on public.contractor_teams(contractor_id);

-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- Auto-update worker rating + total_reviews after a new review
create or replace function public.update_worker_rating()
returns trigger language plpgsql security definer as $$
begin
  update public.worker_details
  set
    rating        = coalesce((select round(avg(r.rating)::numeric, 2) from public.reviews r where r.worker_id = NEW.worker_id), 0),
    total_reviews = (select count(*) from public.reviews r where r.worker_id = NEW.worker_id)
  where user_id = NEW.worker_id;
  return NEW;
end;
$$;

drop trigger if exists trg_update_worker_rating on public.reviews;
create trigger trg_update_worker_rating
  after insert on public.reviews
  for each row execute function public.update_worker_rating();

-- Auto-increment completed_jobs when booking transitions to 'completed'
create or replace function public.handle_booking_completed()
returns trigger language plpgsql security definer as $$
begin
  if NEW.status = 'completed' and OLD.status <> 'completed' then
    update public.worker_details
    set completed_jobs = completed_jobs + 1
    where user_id = NEW.worker_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_booking_completed on public.bookings;
create trigger trg_booking_completed
  after update on public.bookings
  for each row execute function public.handle_booking_completed();

-- Auto-create profile when a new Supabase auth user is created (supports email-confirmed signup)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, role, phone, location)
  values (
    NEW.id,
    NEW.email,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    coalesce(NEW.raw_user_meta_data ->> 'role', 'customer'),
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'location'
  )
  on conflict (id) do nothing;
  return NEW;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-create worker_details row when a 'worker' profile is inserted
create or replace function public.handle_worker_profile()
returns trigger language plpgsql security definer as $$
begin
  if NEW.role = 'worker' then
    insert into public.worker_details (user_id, skills)
    values (NEW.id, '{}')
    on conflict (user_id) do nothing;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_create_worker_details on public.profiles;
create trigger trg_create_worker_details
  after insert on public.profiles
  for each row execute function public.handle_worker_profile();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin NEW.updated_at = now(); return NEW; end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists trg_worker_details_updated on public.worker_details;
create trigger trg_worker_details_updated before update on public.worker_details for each row execute function public.set_updated_at();

drop trigger if exists trg_jobs_updated on public.jobs;
create trigger trg_jobs_updated before update on public.jobs for each row execute function public.set_updated_at();

drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings for each row execute function public.set_updated_at();

drop trigger if exists trg_sos_reports_updated on public.sos_reports;
create trigger trg_sos_reports_updated before update on public.sos_reports for each row execute function public.set_updated_at();

-- ============================================================
-- 5. ROW-LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.worker_details enable row level security;
alter table public.jobs enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.sos_reports enable row level security;
alter table public.emergency_bookings enable row level security;
alter table public.contractor_teams enable row level security;

-- PROFILES
create policy "profiles_select_all"  on public.profiles for select using (true);
create policy "profiles_insert_own"  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles for update using (auth.uid() = id);

-- WORKER_DETAILS
create policy "wd_select_all"  on public.worker_details for select using (true);
create policy "wd_insert_own"  on public.worker_details for insert with check (auth.uid() = user_id);
create policy "wd_update_own"  on public.worker_details for update using (auth.uid() = user_id);

-- JOBS
create policy "jobs_select_all"   on public.jobs for select using (true);
create policy "jobs_insert_own"   on public.jobs for insert with check (auth.uid() = customer_id);
create policy "jobs_update_own"   on public.jobs for update using (auth.uid() = customer_id);
create policy "jobs_delete_own"   on public.jobs for delete using (auth.uid() = customer_id);

-- BOOKINGS
create policy "bookings_select_parties"  on public.bookings for select using (auth.uid() = customer_id or auth.uid() = worker_id);
create policy "bookings_insert_customer" on public.bookings for insert with check (auth.uid() = customer_id);
create policy "bookings_update_parties"  on public.bookings for update using (auth.uid() = customer_id or auth.uid() = worker_id);

-- REVIEWS
create policy "reviews_select_all"  on public.reviews for select using (true);
create policy "reviews_insert_own"  on public.reviews for insert with check (auth.uid() = customer_id);

-- MESSAGES
create policy "messages_select_parties"  on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "messages_insert_sender"   on public.messages for insert with check (auth.uid() = sender_id);
create policy "messages_update_receiver" on public.messages for update using (auth.uid() = receiver_id);

-- SOS_REPORTS (workers only)
create policy "sos_select_own"   on public.sos_reports for select using (auth.uid() = worker_id);
create policy "sos_insert_own"   on public.sos_reports for insert with check (auth.uid() = worker_id);

-- EMERGENCY_BOOKINGS
create policy "emergency_select_parties" on public.emergency_bookings for select using (auth.uid() = customer_id or auth.uid() = worker_id);
create policy "emergency_insert_any"     on public.emergency_bookings for insert with check (auth.uid() = customer_id);

-- CONTRACTOR_TEAMS
create policy "ct_select_own"   on public.contractor_teams for select using (auth.uid() = contractor_id or auth.uid() = worker_id);
create policy "ct_insert_own"   on public.contractor_teams for insert with check (auth.uid() = contractor_id);
create policy "ct_update_own"   on public.contractor_teams for update using (auth.uid() = contractor_id);

-- ============================================================
-- 6. REALTIME
-- ============================================================

alter publication supabase_realtime add table public.messages;

-- ============================================================
-- 7. SEED DATA
-- 1 admin + 3 customers + 10 workers
-- Password for ALL demo accounts: SkillPass123
-- ============================================================

do $$
declare
  v_admin_id uuid := '00000001-0000-0000-0000-000000000001';
  v_c1 uuid := '00000002-0000-0000-0000-000000000001';
  v_c2 uuid := '00000002-0000-0000-0000-000000000002';
  v_c3 uuid := '00000002-0000-0000-0000-000000000003';
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
  -- bcrypt hash of "SkillPass123" (cost 10)
  v_pw  text := '$2a$10$PJkpGPMBNGKU3lY0OSSmqOEfRsQ.Wr7LNGH8bOeNUcQFbVBkTFEC2';
begin

  -- ── Auth users ────────────────────────────────────────────
  insert into auth.users
    (instance_id, id, aud, role, email, encrypted_password,
     email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
     created_at, updated_at, confirmation_token, recovery_token)
  values
    ('00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated','authenticated',
     'admin@skillconnect.app', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_c1, 'authenticated','authenticated',
     'sarah@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_c2, 'authenticated','authenticated',
     'james@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_c3, 'authenticated','authenticated',
     'priya@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w1, 'authenticated','authenticated',
     'mike.plumber@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w2, 'authenticated','authenticated',
     'ana.electrician@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w3, 'authenticated','authenticated',
     'carlos.painter@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w4, 'authenticated','authenticated',
     'leo.mason@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w5, 'authenticated','authenticated',
     'grace.carpenter@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w6, 'authenticated','authenticated',
     'tom.mechanic@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w7, 'authenticated','authenticated',
     'nina.cleaner@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w8, 'authenticated','authenticated',
     'sam.actechnician@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w9, 'authenticated','authenticated',
     'fatima.electrician@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'',''),
    ('00000000-0000-0000-0000-000000000000', v_w10, 'authenticated','authenticated',
     'jose.plumber@example.com', v_pw, now(),
     '{"provider":"email","providers":["email"]}','{}', now(), now(),'','')
  on conflict (id) do nothing;

  -- ── Profiles (on_auth_user_created trigger fires above; upsert overwrites with full data) ──
  insert into public.profiles (id, email, full_name, role, phone, location, is_verified)
  values
    (v_admin_id, 'admin@skillconnect.app',      'Admin User',          'admin',    '+1-555-000-0001', 'New York, NY',      true),
    (v_c1,       'sarah@example.com',            'Sarah Johnson',       'customer', '+1-555-100-0001', 'Brooklyn, NY',      false),
    (v_c2,       'james@example.com',            'James Williams',      'customer', '+1-555-100-0002', 'Manhattan, NY',     false),
    (v_c3,       'priya@example.com',            'Priya Patel',         'customer', '+1-555-100-0003', 'Queens, NY',        false),
    (v_w1,       'mike.plumber@example.com',     'Mike Rodriguez',      'worker',   '+1-555-200-0001', 'Bronx, NY',         true),
    (v_w2,       'ana.electrician@example.com',  'Ana Silva',           'worker',   '+1-555-200-0002', 'Brooklyn, NY',      true),
    (v_w3,       'carlos.painter@example.com',   'Carlos Martinez',     'worker',   '+1-555-200-0003', 'Queens, NY',        true),
    (v_w4,       'leo.mason@example.com',        'Leo Thompson',        'worker',   '+1-555-200-0004', 'Staten Island, NY', true),
    (v_w5,       'grace.carpenter@example.com',  'Grace Chen',          'worker',   '+1-555-200-0005', 'Manhattan, NY',     true),
    (v_w6,       'tom.mechanic@example.com',     'Tom Jackson',         'worker',   '+1-555-200-0006', 'Newark, NJ',        false),
    (v_w7,       'nina.cleaner@example.com',     'Nina Okafor',         'worker',   '+1-555-200-0007', 'Harlem, NY',        true),
    (v_w8,       'sam.actechnician@example.com', 'Samuel Hernandez',    'worker',   '+1-555-200-0008', 'Jersey City, NJ',   true),
    (v_w9,       'fatima.electrician@example.com','Fatima Al-Hassan',   'worker',   '+1-555-200-0009', 'Long Island, NY',   false),
    (v_w10,      'jose.plumber@example.com',     'Jose Ferreira',       'worker',   '+1-555-200-0010', 'Hoboken, NJ',       true)
  on conflict (id) do update set
    full_name   = excluded.full_name,
    role        = excluded.role,
    phone       = excluded.phone,
    location    = excluded.location,
    is_verified = excluded.is_verified;

  -- ── Worker Details (trg_create_worker_details fired above; upsert fills detailed data) ──
  insert into public.worker_details
    (user_id, skills, experience_years, hourly_rate, daily_rate,
     bio, availability_status, rating, total_reviews, completed_jobs,
     skill_trust_score, languages, emergency_available)
  values
    (v_w1,  array['Plumber','Pipe Fitting','Drain Cleaning'],              8, 65,  420,
     'Expert plumber with 8 years handling residential and commercial plumbing. Emergency call-outs available 24/7.',
     'available', 4.8, 42, 38, 92, array['English','Spanish'], true),
    (v_w2,  array['Electrician','Wiring','Circuit Breaker','Panel Upgrade'], 12, 85, 550,
     'Licensed electrician specializing in full home rewiring, smart home setups, and panel upgrades.',
     'available', 4.9, 67, 61, 96, array['English','Portuguese'], false),
    (v_w3,  array['Painter','Interior Painting','Exterior Painting','Wallpaper'], 6, 45, 300,
     'Professional painter delivering crisp, clean finishes. Specializes in residential interiors and exteriors.',
     'available', 4.6, 31, 27, 88, array['English','Spanish'], false),
    (v_w4,  array['Mason','Bricklaying','Concrete','Tiling','Stonework'],  15, 70, 460,
     'Master mason with 15 years in bricklaying, tiling, and decorative stonework for homes and gardens.',
     'busy',      4.7, 58, 54, 91, array['English'], false),
    (v_w5,  array['Carpenter','Cabinetry','Furniture Assembly','Flooring'], 9, 60, 390,
     'Skilled carpenter specializing in custom cabinetry, hardwood flooring, and fine furniture installation.',
     'available', 4.8, 39, 35, 90, array['English','Mandarin'], false),
    (v_w6,  array['Mechanic','Auto Repair','Oil Change','Brake Service'],   11, 75, 480,
     'ASE-certified mobile mechanic. I come to you for oil changes, brakes, diagnostics, and most repairs.',
     'available', 4.4, 25, 22, 82, array['English'], false),
    (v_w7,  array['Cleaner','Deep Cleaning','Move-out Cleaning','Commercial Cleaning'], 5, 40, 260,
     'Detail-oriented cleaning professional. Eco-friendly products, flexible hours, same-day bookings available.',
     'available', 4.9, 85, 80, 94, array['English','Yoruba'], false),
    (v_w8,  array['AC Technician','HVAC','Refrigeration','Ductwork'],      7, 80, 520,
     'HVAC specialist handling installations, repairs, and seasonal tune-ups for residential and light commercial.',
     'available', 4.7, 48, 44, 89, array['English','Spanish'], true),
    (v_w9,  array['Electrician','Lighting','Security Systems','Smart Home'], 4, 65, 420,
     'Up-and-coming electrician with a focus on modern lighting design and smart home automation.',
     'available', 4.3, 15, 13, 78, array['English','Arabic'], false),
    (v_w10, array['Plumber','Water Heater','Bathroom Remodel','Gas Lines'], 20, 90, 580,
     'Senior plumber with 20 years of experience. No job too big — specializing in full bathroom remodels and gas lines.',
     'available', 4.9, 112, 105, 97, array['English','Portuguese'], true)
  on conflict (user_id) do update set
    skills              = excluded.skills,
    experience_years    = excluded.experience_years,
    hourly_rate         = excluded.hourly_rate,
    daily_rate          = excluded.daily_rate,
    bio                 = excluded.bio,
    availability_status = excluded.availability_status,
    rating              = excluded.rating,
    total_reviews       = excluded.total_reviews,
    completed_jobs      = excluded.completed_jobs,
    skill_trust_score   = excluded.skill_trust_score,
    languages           = excluded.languages,
    emergency_available = excluded.emergency_available;

  -- ── Sample Jobs ───────────────────────────────────────────
  insert into public.jobs (id, customer_id, title, description, skill, budget_min, budget_max, location, status, created_at)
  values
    ('10000001-0000-0000-0000-000000000001', v_c1, 'Fix leaking kitchen sink',
     'Kitchen sink has been dripping for two weeks, need it fixed ASAP.',
     'Plumber', 100, 200, 'Brooklyn, NY', 'open', now() - interval '2 days'),
    ('10000001-0000-0000-0000-000000000002', v_c2, 'Install ceiling fan in bedroom',
     'Need a new ceiling fan installed with light kit.',
     'Electrician', 150, 250, 'Manhattan, NY', 'in_progress', now() - interval '5 days'),
    ('10000001-0000-0000-0000-000000000003', v_c3, 'Paint living room and hallway',
     'Two rooms, neutral colours, walls only.',
     'Painter', 300, 500, 'Queens, NY', 'completed', now() - interval '10 days'),
    ('10000001-0000-0000-0000-000000000004', v_c1, 'Deep clean apartment before move-out',
     '3-bedroom apartment, full deep clean required.',
     'Cleaner', 200, 300, 'Brooklyn, NY', 'open', now() - interval '1 day'),
    ('10000001-0000-0000-0000-000000000005', v_c2, 'AC unit not cooling',
     'Central AC stopped cooling, need diagnosis and repair.',
     'AC Technician', 200, 400, 'Manhattan, NY', 'open', now())
  on conflict (id) do nothing;

  -- ── Sample Bookings ───────────────────────────────────────
  insert into public.bookings (id, job_id, customer_id, worker_id, status, notes, scheduled_date, total_amount, created_at)
  values
    ('20000001-0000-0000-0000-000000000001',
     '10000001-0000-0000-0000-000000000002', v_c2, v_w2,
     'completed', 'Please bring all necessary tools.',
     now()::date - 4, 200.00, now() - interval '5 days'),
    ('20000001-0000-0000-0000-000000000002',
     '10000001-0000-0000-0000-000000000003', v_c3, v_w3,
     'completed', 'Prefer water-based paint, two coats.',
     now()::date - 9, 400.00, now() - interval '10 days'),
    ('20000001-0000-0000-0000-000000000003',
     '10000001-0000-0000-0000-000000000001', v_c1, v_w1,
     'pending', 'Need same-day if possible.',
     now()::date + 1, 150.00, now() - interval '1 day')
  on conflict (id) do nothing;

  -- ── Sample Reviews ────────────────────────────────────────
  insert into public.reviews (booking_id, customer_id, worker_id, rating, comment, created_at)
  values
    ('20000001-0000-0000-0000-000000000001', v_c2, v_w2, 5,
     'Ana was fantastic — arrived on time, very professional and the fan looks great!',
     now() - interval '3 days'),
    ('20000001-0000-0000-0000-000000000002', v_c3, v_w3, 5,
     'Carlos did an outstanding job. Very neat and tidy. Highly recommend.',
     now() - interval '8 days')
  on conflict (booking_id, customer_id) do nothing;

  -- ── Sample Messages ───────────────────────────────────────
  insert into public.messages (sender_id, receiver_id, content, created_at)
  values
    (v_c1, v_w1, 'Hi Mike, are you available this weekend to fix my sink?',          now() - interval '2 hours'),
    (v_w1, v_c1, 'Hi Sarah! Yes, I can come Saturday morning. Does 9am work?',       now() - interval '1 hour 45 minutes'),
    (v_c1, v_w1, 'Perfect, 9am Saturday works great. See you then!',                 now() - interval '1 hour 30 minutes'),
    (v_c2, v_w2, 'Ana, loved the fan installation. Could you also help with outdoor lighting?', now() - interval '3 days'),
    (v_w2, v_c2, 'Thanks James! Absolutely, I can quote outdoor lighting. Want me to come take a look?', now() - interval '2 days 22 hours')
  on conflict do nothing;

end $$;
