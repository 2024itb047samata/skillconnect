export type UserRole = 'customer' | 'worker' | 'admin';
export interface Profile { id: string; email: string; full_name: string; phone?: string; location?: string; avatar_url?: string; role: UserRole; is_verified: boolean; created_at: string; updated_at: string; }
export interface WorkerDetails { id: string; user_id: string; skills: string[]; experience_years: number; hourly_rate?: number; daily_rate?: number; availability_status: 'available' | 'busy' | 'offline'; bio?: string; completed_jobs: number; rating: number; total_reviews: number; profile?: Profile; }
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export interface Job { id: string; customer_id: string; title: string; description: string; skill: string; budget_min?: number; budget_max?: number; location: string; preferred_date?: string; status: JobStatus; created_at: string; updated_at: string; customer?: Profile; }
export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
export interface Booking { id: string; job_id?: string; customer_id: string; worker_id: string; status: BookingStatus; scheduled_date?: string; scheduled_time?: string; total_amount?: number; notes?: string; created_at: string; updated_at: string; customer?: Profile; worker?: Profile; job?: Job; }
export interface Review { id: string; booking_id: string; customer_id: string; worker_id: string; rating: number; comment?: string; created_at: string; customer?: Profile; }
export interface Message { id: string; sender_id: string; receiver_id: string; booking_id?: string; content: string; read_at?: string; created_at: string; sender?: Profile; receiver?: Profile; }
