-- ============================================================
-- SkillConnect — Complete Database Setup + Seed Data
-- Run this ONCE in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABLE DEFINITIONS
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'customer' check (role in ('customer', 'worker', 'admin')),
  phone text,
  location text,
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.worker_details (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  skills text[] not null default '{}',
  experience_years int not null default 0,
  hourly_rate numeric(10,2),
  bio text,
  availability text not null default 'available',
  rating numeric(3,2) not null default 0,
  total_reviews int not null default 0,
  skill_trust_score int not null default 70,
  portfolio_urls text[] not null default '{}',
  certifications text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  budget numeric(10,2),
  location text,
  status text not null default 'open' check (status in ('open', 'assigned', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  notes text,
  scheduled_at timestamptz,
  amount numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

create index if not exists idx_worker_details_user_id on public.worker_details(user_id);
create index if not exists idx_worker_details_rating on public.worker_details(rating desc);
create index if not exists idx_jobs_customer_id on public.jobs(customer_id);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_bookings_customer_id on public.bookings(customer_id);
create index if not exists idx_bookings_worker_id on public.bookings(worker_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_reviews_worker_id on public.reviews(worker_id);
create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_messages_receiver on public.messages(receiver_id);
create index if not exists idx_messages_thread on public.messages(sender_id, receiver_id, created_at);

-- ============================================================
-- 3. TRIGGERS — auto-update worker rating after review insert
-- ============================================================

create or replace function public.update_worker_rating()
returns trigger language plpgsql security definer as $$
begin
  update public.worker_details
  set
    rating = (select round(avg(rating)::numeric, 2) from public.reviews where worker_id = NEW.worker_id),
    total_reviews = (select count(*) from public.reviews where worker_id = NEW.worker_id)
  where user_id = NEW.worker_id;
  return NEW;
end;
$$;

drop trigger if exists trg_update_worker_rating on public.reviews;
create trigger trg_update_worker_rating
  after insert on public.reviews
  for each row execute function public.update_worker_rating();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin NEW.updated_at = now(); return NEW; end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists trg_worker_details_updated on public.worker_details;
create trigger trg_worker_details_updated before update on public.worker_details for each row execute function public.set_updated_at();

-- ============================================================
-- 4. ROW-LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.worker_details enable row level security;
alter table public.jobs enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;

-- PROFILES
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles for select using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- WORKER_DETAILS
drop policy if exists "worker_details_select_all" on public.worker_details;
create policy "worker_details_select_all" on public.worker_details for select using (true);

drop policy if exists "worker_details_insert_own" on public.worker_details;
create policy "worker_details_insert_own" on public.worker_details for insert with check (auth.uid() = user_id);

drop policy if exists "worker_details_update_own" on public.worker_details;
create policy "worker_details_update_own" on public.worker_details for update using (auth.uid() = user_id);

-- JOBS
drop policy if exists "jobs_select_all" on public.jobs;
create policy "jobs_select_all" on public.jobs for select using (true);

drop policy if exists "jobs_insert_customer" on public.jobs;
create policy "jobs_insert_customer" on public.jobs for insert with check (auth.uid() = customer_id);

drop policy if exists "jobs_update_own" on public.jobs;
create policy "jobs_update_own" on public.jobs for update using (auth.uid() = customer_id);

-- BOOKINGS
drop policy if exists "bookings_select_parties" on public.bookings;
create policy "bookings_select_parties" on public.bookings for select using (auth.uid() = customer_id or auth.uid() = worker_id);

drop policy if exists "bookings_insert_customer" on public.bookings;
create policy "bookings_insert_customer" on public.bookings for insert with check (auth.uid() = customer_id);

drop policy if exists "bookings_update_parties" on public.bookings;
create policy "bookings_update_parties" on public.bookings for update using (auth.uid() = customer_id or auth.uid() = worker_id);

-- REVIEWS
drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all" on public.reviews for select using (true);

drop policy if exists "reviews_insert_customer" on public.reviews;
create policy "reviews_insert_customer" on public.reviews for insert with check (auth.uid() = customer_id);

-- MESSAGES
drop policy if exists "messages_select_parties" on public.messages;
create policy "messages_select_parties" on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "messages_insert_sender" on public.messages;
create policy "messages_insert_sender" on public.messages for insert with check (auth.uid() = sender_id);

drop policy if exists "messages_update_receiver" on public.messages;
create policy "messages_update_receiver" on public.messages for update using (auth.uid() = receiver_id);

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- 5. SEED DATA — 1 admin, 3 customers, 10 workers
--    Password for ALL seed accounts: SkillPass123
-- ============================================================

-- Create auth users
do $$
declare
  v_admin_id uuid := '00000001-0000-0000-0000-000000000001';
  v_cust1_id uuid := '00000002-0000-0000-0000-000000000001';
  v_cust2_id uuid := '00000002-0000-0000-0000-000000000002';
  v_cust3_id uuid := '00000002-0000-0000-0000-000000000003';
  v_w1_id    uuid := '00000003-0000-0000-0000-000000000001';
  v_w2_id    uuid := '00000003-0000-0000-0000-000000000002';
  v_w3_id    uuid := '00000003-0000-0000-0000-000000000003';
  v_w4_id    uuid := '00000003-0000-0000-0000-000000000004';
  v_w5_id    uuid := '00000003-0000-0000-0000-000000000005';
  v_w6_id    uuid := '00000003-0000-0000-0000-000000000006';
  v_w7_id    uuid := '00000003-0000-0000-0000-000000000007';
  v_w8_id    uuid := '00000003-0000-0000-0000-000000000008';
  v_w9_id    uuid := '00000003-0000-0000-0000-000000000009';
  v_w10_id   uuid := '00000003-0000-0000-0000-000000000010';
  v_pw text := '$2a$10$PJkpGPMBNGKU3lY0OSSmqOEfRsQ.Wr7LNGH8bOeNUcQFbVBkTFEC2'; -- SkillPass123
begin
  -- Admin
  insert into auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token)
  values ('00000000-0000-0000-0000-000000000000',v_admin_id,'authenticated','authenticated','admin@skillconnect.app',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','')
  on conflict (id) do nothing;

  -- Customers
  insert into auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token)
  values
  ('00000000-0000-0000-0000-000000000000',v_cust1_id,'authenticated','authenticated','sarah@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_cust2_id,'authenticated','authenticated','james@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_cust3_id,'authenticated','authenticated','priya@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','')
  on conflict (id) do nothing;

  -- Workers
  insert into auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token)
  values
  ('00000000-0000-0000-0000-000000000000',v_w1_id,'authenticated','authenticated','mike.plumber@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w2_id,'authenticated','authenticated','ana.electrician@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w3_id,'authenticated','authenticated','carlos.painter@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w4_id,'authenticated','authenticated','leo.mason@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w5_id,'authenticated','authenticated','grace.carpenter@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w6_id,'authenticated','authenticated','tom.mechanic@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w7_id,'authenticated','authenticated','nina.cleaner@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w8_id,'authenticated','authenticated','sam.actechnician@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w9_id,'authenticated','authenticated','fatima.electrician@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'',''),
  ('00000000-0000-0000-0000-000000000000',v_w10_id,'authenticated','authenticated','jose.plumber@example.com',v_pw,now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','')
  on conflict (id) do nothing;

  -- Profiles
  insert into public.profiles (id,email,full_name,role,phone,location,is_verified,created_at) values
  (v_admin_id,'admin@skillconnect.app','Admin User','admin','+1-555-000-0001','New York, NY',true,now()),
  (v_cust1_id,'sarah@example.com','Sarah Johnson','customer','+1-555-100-0001','Brooklyn, NY',false,now()),
  (v_cust2_id,'james@example.com','James Williams','customer','+1-555-100-0002','Manhattan, NY',false,now()),
  (v_cust3_id,'priya@example.com','Priya Patel','customer','+1-555-100-0003','Queens, NY',false,now()),
  (v_w1_id,'mike.plumber@example.com','Mike Rodriguez','worker','+1-555-200-0001','Bronx, NY',true,now()),
  (v_w2_id,'ana.electrician@example.com','Ana Silva','worker','+1-555-200-0002','Brooklyn, NY',true,now()),
  (v_w3_id,'carlos.painter@example.com','Carlos Martinez','worker','+1-555-200-0003','Queens, NY',true,now()),
  (v_w4_id,'leo.mason@example.com','Leo Thompson','worker','+1-555-200-0004','Staten Island, NY',true,now()),
  (v_w5_id,'grace.carpenter@example.com','Grace Chen','worker','+1-555-200-0005','Manhattan, NY',true,now()),
  (v_w6_id,'tom.mechanic@example.com','Tom Jackson','worker','+1-555-200-0006','Newark, NJ',false,now()),
  (v_w7_id,'nina.cleaner@example.com','Nina Okafor','worker','+1-555-200-0007','Harlem, NY',true,now()),
  (v_w8_id,'sam.actechnician@example.com','Samuel Hernandez','worker','+1-555-200-0008','Jersey City, NJ',true,now()),
  (v_w9_id,'fatima.electrician@example.com','Fatima Al-Hassan','worker','+1-555-200-0009','Long Island, NY',false,now()),
  (v_w10_id,'jose.plumber@example.com','Jose Ferreira','worker','+1-555-200-0010','Hoboken, NJ',true,now())
  on conflict (id) do nothing;

  -- Worker Details
  insert into public.worker_details (user_id,skills,experience_years,hourly_rate,bio,availability,rating,total_reviews,skill_trust_score) values
  (v_w1_id, array['Plumber','Pipe Fitting','Drain Cleaning'], 8, 65.00,
   'Expert plumber with 8 years handling residential and commercial plumbing. Emergency call-outs available 24/7.',
   'available', 4.8, 42, 92),
  (v_w2_id, array['Electrician','Wiring','Circuit Breaker','Panel Upgrade'], 12, 85.00,
   'Licensed electrician specializing in full home rewiring, smart home setups, and panel upgrades.',
   'available', 4.9, 67, 96),
  (v_w3_id, array['Painter','Interior Painting','Exterior Painting','Wallpaper'], 6, 45.00,
   'Professional painter delivering crisp, clean finishes. Specializes in residential interiors and exteriors.',
   'available', 4.6, 31, 88),
  (v_w4_id, array['Mason','Bricklaying','Concrete','Tiling','Stonework'], 15, 70.00,
   'Master mason with 15 years in bricklaying, tiling, and decorative stonework for homes and gardens.',
   'busy', 4.7, 58, 91),
  (v_w5_id, array['Carpenter','Cabinetry','Furniture Assembly','Flooring'], 9, 60.00,
   'Skilled carpenter specializing in custom cabinetry, hardwood flooring, and fine furniture installation.',
   'available', 4.8, 39, 90),
  (v_w6_id, array['Mechanic','Auto Repair','Oil Change','Brake Service','Diagnostics'], 11, 75.00,
   'ASE-certified mobile mechanic. I come to you for oil changes, brakes, diagnostics, and most repairs.',
   'available', 4.4, 25, 82),
  (v_w7_id, array['Cleaner','Deep Cleaning','Move-out Cleaning','Commercial Cleaning'], 5, 40.00,
   'Detail-oriented cleaning professional. Eco-friendly products, flexible hours, same-day bookings available.',
   'available', 4.9, 85, 94),
  (v_w8_id, array['AC Technician','HVAC','Refrigeration','Ductwork'], 7, 80.00,
   'HVAC specialist handling installations, repairs, and seasonal tune-ups for residential and light commercial.',
   'available', 4.7, 48, 89),
  (v_w9_id, array['Electrician','Lighting','Security Systems','Smart Home'], 4, 65.00,
   'Up-and-coming electrician with a focus on modern lighting design and smart home automation.',
   'available', 4.3, 15, 78),
  (v_w10_id, array['Plumber','Water Heater','Bathroom Remodel','Gas Lines'], 20, 90.00,
   'Senior plumber with 20 years of experience. No job too big — specializing in full bathroom remodels and gas lines.',
   'available', 4.9, 112, 97)
  on conflict (user_id) do nothing;

  -- Sample Jobs
  insert into public.jobs (id,customer_id,title,description,category,budget,location,status,created_at) values
  ('10000001-0000-0000-0000-000000000001',v_cust1_id,'Fix leaking kitchen sink','Kitchen sink has been dripping for two weeks, need it fixed ASAP.','Plumber',150.00,'Brooklyn, NY','open',now() - interval '2 days'),
  ('10000001-0000-0000-0000-000000000002',v_cust2_id,'Install ceiling fan in bedroom','Need a new ceiling fan installed with light kit.','Electrician',200.00,'Manhattan, NY','assigned',now() - interval '5 days'),
  ('10000001-0000-0000-0000-000000000003',v_cust3_id,'Paint living room and hallway','Two rooms, neutral colours, walls only.','Painter',400.00,'Queens, NY','completed',now() - interval '10 days'),
  ('10000001-0000-0000-0000-000000000004',v_cust1_id,'Deep clean apartment before move-out','3-bedroom apartment, full deep clean required.','Cleaner',250.00,'Brooklyn, NY','open',now() - interval '1 day'),
  ('10000001-0000-0000-0000-000000000005',v_cust2_id,'AC unit not cooling','Central AC stopped cooling, need diagnosis and repair.','AC Technician',300.00,'Manhattan, NY','open',now())
  on conflict (id) do nothing;

  -- Sample Bookings
  insert into public.bookings (id,job_id,customer_id,worker_id,status,notes,scheduled_at,amount,created_at) values
  ('20000001-0000-0000-0000-000000000001','10000001-0000-0000-0000-000000000002',v_cust2_id,v_w2_id,'completed','Please bring all necessary tools.',now() - interval '4 days',200.00,now() - interval '5 days'),
  ('20000001-0000-0000-0000-000000000002','10000001-0000-0000-0000-000000000003',v_cust3_id,v_w3_id,'completed','Prefer water-based paint, two coats.',now() - interval '9 days',400.00,now() - interval '10 days'),
  ('20000001-0000-0000-0000-000000000003','10000001-0000-0000-0000-000000000001',v_cust1_id,v_w1_id,'pending','Need same-day if possible.',now() + interval '1 day',150.00,now() - interval '1 day')
  on conflict (id) do nothing;

  -- Sample Reviews
  insert into public.reviews (booking_id,customer_id,worker_id,rating,comment,created_at) values
  ('20000001-0000-0000-0000-000000000001',v_cust2_id,v_w2_id,5,'Ana was fantastic — arrived on time, very professional and the fan looks great!',now() - interval '3 days'),
  ('20000001-0000-0000-0000-000000000002',v_cust3_id,v_w3_id,5,'Carlos did an outstanding job. Very neat and tidy. Highly recommend.',now() - interval '8 days')
  on conflict do nothing;

  -- Sample Messages
  insert into public.messages (sender_id,receiver_id,content,created_at) values
  (v_cust1_id,v_w1_id,'Hi Mike, are you available this weekend to fix my sink?',now() - interval '2 hours'),
  (v_w1_id,v_cust1_id,'Hi Sarah! Yes, I can come Saturday morning. Does 9am work?',now() - interval '1 hour 45 minutes'),
  (v_cust1_id,v_w1_id,'Perfect, 9am Saturday works great. See you then!',now() - interval '1 hour 30 minutes'),
  (v_cust2_id,v_w2_id,'Ana, loved the fan installation. Could you also help with outdoor lighting?',now() - interval '3 days'),
  (v_w2_id,v_cust2_id,'Thanks James! Absolutely, I can quote outdoor lighting. Want me to come take a look?',now() - interval '2 days 22 hours')
  on conflict do nothing;

end $$;
