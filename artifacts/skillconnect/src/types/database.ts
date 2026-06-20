export type UserRole = 'customer' | 'worker' | 'admin' | 'contractor';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerDetails {
  id: string;
  user_id: string;
  skills: string[];
  experience_years: number;
  hourly_rate?: number;
  daily_rate?: number;
  availability_status: 'available' | 'busy' | 'offline';
  bio?: string;
  completed_jobs: number;
  rating: number;
  total_reviews: number;
  skill_trust_score: number;
  ai_verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  ai_confidence_rating: number;
  total_earnings: number;
  this_month_earnings: number;
  response_time_minutes: number;
  repeat_customers: number;
  is_women_professional: boolean;
  languages: string[];
  certifications: string[];
  emergency_available: boolean;
  profile?: Profile;
}

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  skill: string;
  budget_min?: number;
  budget_max?: number;
  location: string;
  preferred_date?: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  customer?: Profile;
  applications?: JobApplication[];
}

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface Booking {
  id: string;
  job_id?: string;
  customer_id: string;
  worker_id: string;
  status: BookingStatus;
  scheduled_date?: string;
  scheduled_time?: string;
  total_amount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Profile;
  worker?: Profile;
  job?: Job;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  worker_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  customer?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  booking_id?: string;
  content: string;
  read_at?: string;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface JobApplication {
  id: string;
  job_id: string;
  worker_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  cover_note?: string;
  created_at: string;
  worker?: Profile;
  worker_details?: WorkerDetails;
  job?: Job;
}

export interface PortfolioItem {
  id: string;
  worker_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  title?: string;
  description?: string;
  skill_category?: string;
  ai_quality_score: number;
  ai_complexity_score: number;
  is_featured: boolean;
  created_at: string;
}

export interface SOSReport {
  id: string;
  worker_id: string;
  report_type: 'non_payment' | 'wage_dispute' | 'unsafe_environment' | 'harassment' | 'other';
  description?: string;
  location?: string;
  evidence_urls: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface EmergencyBooking {
  id: string;
  customer_id: string;
  worker_id?: string;
  emergency_type: string;
  location?: string;
  description?: string;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'cancelled';
  eta_minutes?: number;
  created_at: string;
  resolved_at?: string;
}

export interface ContractorTeam {
  id: string;
  contractor_id: string;
  worker_id: string;
  site_name?: string;
  role: string;
  daily_wage?: number;
  is_active: boolean;
  created_at: string;
}
