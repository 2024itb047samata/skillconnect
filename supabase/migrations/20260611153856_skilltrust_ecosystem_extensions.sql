-- Add contractor role to profiles check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role = ANY (ARRAY['customer'::text, 'worker'::text, 'admin'::text, 'contractor'::text]));

-- Extend worker_details with SkillTrust and new features
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS skill_trust_score integer DEFAULT 0;
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS ai_verification_status text DEFAULT 'unverified' CHECK (ai_verification_status = ANY (ARRAY['unverified'::text, 'pending'::text, 'verified'::text, 'rejected'::text]));
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS ai_confidence_rating numeric(3,2) DEFAULT 0;
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS total_earnings numeric DEFAULT 0;
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS this_month_earnings numeric DEFAULT 0;
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS response_time_minutes integer DEFAULT 0;
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS repeat_customers integer DEFAULT 0;
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS is_women_professional boolean DEFAULT false;
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS languages text[] DEFAULT ARRAY['English']::text[];
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS certifications text[] DEFAULT '{}'::text[];
ALTER TABLE worker_details ADD COLUMN IF NOT EXISTS emergency_available boolean DEFAULT false;

-- Create portfolios table for work photos/videos
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type = ANY (ARRAY['image'::text, 'video'::text])),
  title text,
  description text,
  skill_category text,
  ai_quality_score numeric(3,2) DEFAULT 0,
  ai_complexity_score numeric(3,2) DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create SOS reports table for worker safety
CREATE TABLE IF NOT EXISTS sos_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type = ANY (ARRAY['non_payment'::text, 'wage_dispute'::text, 'unsafe_environment'::text, 'harassment'::text, 'other'::text])),
  description text,
  location text,
  evidence_urls text[] DEFAULT '{}'::text[],
  status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending'::text, 'investigating'::text, 'resolved'::text, 'dismissed'::text])),
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create attendance tracking table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  site_location text,
  check_in_time timestamptz,
  check_out_time timestamptz,
  check_in_location point,
  check_out_location point,
  status text DEFAULT 'present' CHECK (status = ANY (ARRAY['present'::text, 'absent'::text, 'late'::text, 'early_leave'::text])),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuing_organization text,
  issue_date date,
  expiry_date date,
  certificate_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'expired'::text])),
  created_at timestamptz DEFAULT now()
);

-- Create skill development modules
CREATE TABLE IF NOT EXISTS skill_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  duration_hours integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create worker skill progress tracking
CREATE TABLE IF NOT EXISTS worker_skill_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES skill_modules(id) ON DELETE CASCADE,
  progress_percent integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(worker_id, module_id)
);

-- Create emergency bookings table
CREATE TABLE IF NOT EXISTS emergency_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  emergency_type text NOT NULL,
  location text,
  description text,
  urgency_level text DEFAULT 'high' CHECK (urgency_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])),
  status text DEFAULT 'open' CHECK (status = ANY (ARRAY['open'::text, 'assigned'::text, 'in_progress'::text, 'resolved'::text, 'cancelled'::text])),
  eta_minutes integer,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create contractor team assignments
CREATE TABLE IF NOT EXISTS contractor_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  site_name text,
  role text DEFAULT 'worker',
  daily_wage numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolios
CREATE POLICY "Workers can view own portfolios" ON portfolios FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers can create own portfolios" ON portfolios FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Workers can update own portfolios" ON portfolios FOR UPDATE USING (auth.uid() = worker_id);
CREATE POLICY "Workers can delete own portfolios" ON portfolios FOR DELETE USING (auth.uid() = worker_id);
CREATE POLICY "Anyone can view featured portfolios" ON portfolios FOR SELECT USING (is_featured = true);

-- Create RLS policies for SOS reports
CREATE POLICY "Workers can view own SOS reports" ON sos_reports FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers can create SOS reports" ON sos_reports FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Admins can manage all SOS reports" ON sos_reports FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for attendance
CREATE POLICY "Workers can view own attendance" ON attendance FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers can create attendance" ON attendance FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Admins and contractors can view attendance" ON attendance FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'contractor'))
);

-- Create RLS policies for certifications
CREATE POLICY "Workers can manage own certifications" ON certifications FOR ALL USING (auth.uid() = worker_id);
CREATE POLICY "Anyone can view verified certifications" ON certifications FOR SELECT USING (verification_status = 'verified');

-- Create RLS policies for skill modules (public read, admin write)
CREATE POLICY "Anyone can view skill modules" ON skill_modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage skill modules" ON skill_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for worker skill progress
CREATE POLICY "Workers can view own progress" ON worker_skill_progress FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers can manage own progress" ON worker_skill_progress FOR ALL USING (auth.uid() = worker_id);

-- Create RLS policies for emergency bookings
CREATE POLICY "Customers can view own emergency bookings" ON emergency_bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = worker_id);
CREATE POLICY "Customers can create emergency bookings" ON emergency_bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Workers can update assigned bookings" ON emergency_bookings FOR UPDATE USING (auth.uid() = worker_id);

-- Create RLS policies for contractor teams
CREATE POLICY "Contractors can manage teams" ON contractor_teams FOR ALL USING (auth.uid() = contractor_id);
CREATE POLICY "Workers can view team assignments" ON contractor_teams FOR SELECT USING (auth.uid() = worker_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_worker_id ON portfolios(worker_id);
CREATE INDEX IF NOT EXISTS idx_sos_reports_worker_id ON sos_reports(worker_id);
CREATE INDEX IF NOT EXISTS idx_attendance_worker_id ON attendance(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_skill_progress_worker_id ON worker_skill_progress(worker_id);
CREATE INDEX IF NOT EXISTS idx_emergency_bookings_status ON emergency_bookings(status);
CREATE INDEX IF NOT EXISTS idx_contractor_teams_contractor_id ON contractor_teams(contractor_id);
