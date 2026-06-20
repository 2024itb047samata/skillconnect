import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Booking, Job, Review } from '../../types/database';
import { Briefcase, Calendar, Star, Clock, CheckCircle, MapPin, MessageSquare, Settings, X, TrendingUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function WorkerDashboard() {
  const { user, profile, workerDetails } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState<Booking | null>(null);
  const [localStatus, setLocalStatus] = useState(workerDetails?.availability_status || 'available');

  useEffect(() => {
    if (user && workerDetails) { fetchData(); setLocalStatus(workerDetails.availability_status); }
  }, [user, workerDetails]);

  const fetchData = async () => {
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*, customer:profiles!bookings_customer_id_fkey(*)')
      .eq('worker_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (bookingsData) setBookings(bookingsData as Booking[]);

    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .limit(8);
    if (jobsData) {
      const skills = workerDetails?.skills || [];
      const matched = (jobsData as Job[]).filter((j) => skills.some((s) => s.toLowerCase() === j.skill.toLowerCase()));
      setAvailableJobs(matched.length > 0 ? matched : (jobsData as Job[]).slice(0, 4));
    }

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, customer:profiles(*)')
      .eq('worker_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (reviewsData) setReviews(reviewsData as Review[]);
    setLoading(false);
  };

  const updateStatus = async () => {
    await supabase.from('worker_details').update({ availability_status: localStatus }).eq('user_id', user!.id);
    setShowStatusModal(false);
    fetchData();
  };

  const updateBooking = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setShowBookingModal(null);
    fetchData();
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  const stats = [
    { label: 'Jobs Completed', value: workerDetails?.completed_jobs || 0, icon: Briefcase, color: 'from-primary-500 to-primary-600', glow: 'shadow-glow-blue' },
    { label: 'Rating', value: workerDetails?.rating?.toFixed(1) || '0.0', icon: Star, color: 'from-amber-500 to-amber-600', glow: 'shadow-glow' },
    { label: 'Reviews', value: workerDetails?.total_reviews || 0, icon: MessageSquare, color: 'from-emerald-500 to-emerald-600', glow: 'shadow-glow' },
    { label: 'Experience', value: `${workerDetails?.experience_years || 0}y`, icon: Clock, color: 'from-accent-500 to-accent-600', glow: 'shadow-glow-purple' },
  ];

  const quickActions = [
    { label: 'Find Jobs', icon: TrendingUp, href: '/worker/find-jobs', color: 'text-cyan-400' },
    { label: 'Bookings', icon: Calendar, href: '/worker/bookings', color: 'text-emerald-400' },
    { label: 'Messages', icon: MessageSquare, href: '/chat', color: 'text-accent-400' },
    { label: 'Edit Profile', icon: Settings, href: '/worker/profile', color: 'text-primary-400' },
  ];

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 via-transparent to-primary-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm text-surface-400">Worker Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Welcome, <span className="text-gradient">{profile?.full_name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-surface-400 text-lg">Manage your bookings and find new jobs</p>
            </div>
            <motion.button
              onClick={() => setShowStatusModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-3 rounded-xl font-medium flex items-center gap-2.5 ${
                localStatus === 'available' ? 'bg-emerald-500 shadow-[0_0_30px_rgba(52,211,153,0.4)]' :
                localStatus === 'busy' ? 'bg-amber-500 text-amber-950' : 'bg-surface-700 text-surface-300'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${localStatus === 'available' ? 'bg-white animate-pulse' : 'bg-white/50'}`} />
              <span className="capitalize">{localStatus}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card p-6 group card-hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 ${s.glow} group-hover:scale-110 transition-transform`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gradient">{s.value}</div>
              <div className="text-sm text-surface-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((a, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link to={a.href} className="glass-card p-4 flex flex-col items-center group card-hover">
                <a.icon className={`w-8 h-8 ${a.color} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="font-medium text-white">{a.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-400" />
              <h2 className="text-lg font-bold text-white">Pending Requests</h2>
              {pendingBookings.length > 0 && (<span className="badge badge-warning">{pendingBookings.length}</span>)}
            </div>
          </div>
          {pendingBookings.length > 0 ? (
            <div className="space-y-4">
              {pendingBookings.map((b) => (
                <div key={b.id} className="p-4 bg-surface-800/50 rounded-xl flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow">
                      <span className="text-white font-bold">{b.customer?.full_name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{b.customer?.full_name}</p>
                      <p className="text-sm text-surface-400">{b.notes || 'No description'}</p>
                    </div>
                  </div>
                  <motion.button onClick={() => setShowBookingModal(b)} className="premium-button px-4 py-2 text-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>View</motion.button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <p className="text-surface-400">No pending requests</p>
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Matching Jobs</h2>
              </div>
              <Link to="/worker/find-jobs" className="text-primary-400 text-sm hover:text-primary-300 transition-colors">View all →</Link>
            </div>
            {availableJobs.length > 0 ? (
              <div className="space-y-3">
                {availableJobs.slice(0, 4).map((j) => (
                  <div key={j.id} className="p-4 bg-surface-800/50 rounded-xl group hover:bg-surface-800 transition-colors">
                    <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors">{j.title}</h4>
                    <p className="text-xs text-surface-400 truncate mt-1">{j.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-surface-500"><MapPin className="w-3 h-3 inline mr-1" />{j.location}</span>
                      {j.budget_min && (<span className="text-sm font-medium text-gradient">₹{j.budget_min}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-surface-400 mb-3">No matching jobs yet</p>
                <Link to="/worker/find-jobs" className="text-primary-400 text-sm hover:text-primary-300 transition-colors">Browse all jobs →</Link>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Recent Reviews</h2>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="border-b border-surface-800 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{r.customer?.full_name}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-700'}`} />))}
                      </div>
                    </div>
                    {r.comment && (<p className="text-sm text-surface-400 italic">"{r.comment}"</p>)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-surface-400 py-8">No reviews yet</p>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showStatusModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Update Status</h3>
                <button onClick={() => setShowStatusModal(false)} className="p-2 rounded-lg hover:bg-surface-800 transition-colors"><X className="w-5 h-5 text-surface-400" /></button>
              </div>
              <div className="space-y-3">
                {['available', 'busy', 'offline'].map((status) => (
                  <motion.button key={status} onClick={() => setLocalStatus(status as 'available' | 'busy' | 'offline')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${localStatus === status ? 'border-primary-500 bg-primary-500/10' : 'border-surface-700 hover:border-surface-600'}`}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${status === 'available' ? 'bg-emerald-500' : status === 'busy' ? 'bg-amber-500' : 'bg-surface-600'}`} />
                      <span className="font-medium capitalize text-white">{status}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <motion.button onClick={updateStatus} className="w-full mt-6 py-3 premium-button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>Update Status</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBookingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Booking Request</h3>
                <button onClick={() => setShowBookingModal(null)} className="p-2 rounded-lg hover:bg-surface-800 transition-colors"><X className="w-5 h-5 text-surface-400" /></button>
              </div>
              <div className="p-4 bg-surface-800/50 rounded-xl mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-medium text-white">{showBookingModal.customer?.full_name}</p>
                </div>
                <p className="text-sm text-surface-400">{showBookingModal.notes}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.button onClick={() => updateBooking(showBookingModal.id, 'rejected')} className="py-3 glass-button rounded-xl font-medium text-surface-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Decline</motion.button>
                <motion.button onClick={() => updateBooking(showBookingModal.id, 'accepted')} className="py-3 premium-button rounded-xl" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Accept</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
