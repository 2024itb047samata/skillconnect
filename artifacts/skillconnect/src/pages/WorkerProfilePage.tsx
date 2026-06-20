import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { WorkerDetails, Profile, Review } from '../types/database';
import { Star, MapPin, Clock, CheckCircle, Calendar, MessageSquare, Briefcase, ChevronLeft, X, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, Camera, Package, Heart, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkerWithProfile extends WorkerDetails { profile: Profile }

const skillIcons: Record<string, React.ElementType> = {
  Plumber: Wrench, Electrician: Zap, Painter: Paintbrush, Mason: Building2,
  Carpenter: Hammer, Mechanic: Settings, Housekeeper: Sparkles, Cleaner: Sparkles,
  'AC Technician': Wind, 'CCTV Technician': Camera, Driver: Car,
  'Delivery Worker': Package, Caretaker: Heart,
};

export default function WorkerProfilePage() {
  const { workerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<WorkerWithProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingData, setBookingData] = useState({ scheduled_date: '', notes: '' });

  useEffect(() => { if (workerId) fetchWorker(); }, [workerId]);

  const fetchWorker = async () => {
    const { data } = await supabase
      .from('worker_details')
      .select('*, profile:profiles!worker_details_user_id_fkey(*)')
      .eq('user_id', workerId)
      .single();
    if (data) {
      setWorker(data as WorkerWithProfile);
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, customer:profiles(*)')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (reviewsData) setReviews(reviewsData as Review[]);
    }
    setLoading(false);
  };

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    await supabase.from('bookings').insert({
      customer_id: user.id, worker_id: worker!.user_id,
      scheduled_date: bookingData.scheduled_date || null,
      notes: bookingData.notes || null, status: 'pending',
    });
    setShowBookModal(false);
    navigate('/customer/bookings');
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!worker) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <h2 className="text-xl font-bold text-white">Worker not found</h2>
    </div>
  );

  const Icon = worker.skills[0] && skillIcons[worker.skills[0]] ? skillIcons[worker.skills[0]] : Wrench;

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors"
          whileHover={{ x: -4 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </motion.button>
      </div>

      <div className="relative overflow-hidden mt-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-accent-600/20 to-primary-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-8"
          >
            <div className="relative">
              <motion.div className="relative" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                {worker.profile.avatar_url ? (
                  <img src={worker.profile.avatar_url} alt="" className="w-32 h-32 rounded-full object-cover ring-4 ring-white/20 shadow-glow" />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow">
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                )}
                {worker.availability_status === 'available' && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-surface-950 animate-pulse" />
                )}
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="text-4xl font-bold mb-3">{worker.profile.full_name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-surface-300 mb-4">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{worker.profile.location || 'No location'}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{worker.experience_years}y exp</span>
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{worker.completed_jobs} jobs</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold">{worker.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-surface-400">({worker.total_reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((s) => (<span key={s} className="badge badge-primary">{s}</span>))}
                </div>
              </motion.div>
            </div>
            {user?.id !== worker.user_id && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3 w-full md:w-auto"
              >
                <motion.button
                  onClick={() => setShowBookModal(true)}
                  className="premium-button px-8 py-4 text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-5 h-5" />
                  Book Now
                </motion.button>
                <motion.button
                  onClick={() => navigate(`/chat/${worker.user_id}`)}
                  className="glass-button px-8 py-4 text-lg rounded-xl flex items-center justify-center gap-2 text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-5 h-5" />
                  Message
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">About</h2>
              <p className="text-surface-400 leading-relaxed">{worker.bio || 'No description provided.'}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Reviews</h2>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b border-surface-800 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{r.customer?.full_name}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-700'}`} />))}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-surface-400 italic">"{r.comment}"</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-surface-500 py-8">No reviews yet</p>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Availability</h3>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                worker.availability_status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                worker.availability_status === 'busy' ? 'bg-amber-500/20 text-amber-400' : 'bg-surface-700/50 text-surface-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  worker.availability_status === 'available' ? 'bg-emerald-500 animate-pulse' :
                  worker.availability_status === 'busy' ? 'bg-amber-500' : 'bg-surface-600'
                }`} />
                <span className="capitalize">{worker.availability_status}</span>
              </div>
            </motion.div>

            {(worker.hourly_rate || worker.daily_rate) && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4">Pricing</h3>
                <div className="space-y-3">
                  {worker.hourly_rate && (
                    <div className="flex justify-between items-center p-3 bg-surface-800/50 rounded-xl">
                      <span className="text-surface-400">Hourly</span>
                      <span className="text-gradient font-bold text-xl">₹{worker.hourly_rate}/hr</span>
                    </div>
                  )}
                  {worker.daily_rate && (
                    <div className="flex justify-between items-center p-3 bg-surface-800/50 rounded-xl">
                      <span className="text-surface-400">Daily</span>
                      <span className="text-gradient font-bold text-xl">₹{worker.daily_rate}/day</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {worker.languages && worker.languages.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.languages.map((l) => (
                    <span key={l} className="px-3 py-1 bg-surface-800 rounded-full text-sm text-surface-300">{l}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBookModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Book {worker.profile.full_name}</h3>
                <button onClick={() => setShowBookModal(false)} className="p-2 rounded-lg hover:bg-surface-800 transition-colors">
                  <X className="w-5 h-5 text-surface-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Preferred Date</label>
                  <input type="date" value={bookingData.scheduled_date} onChange={(e) => setBookingData({ ...bookingData, scheduled_date: e.target.value })} className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Job Description</label>
                  <textarea value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} rows={4} placeholder="Describe the work needed..." className="input-premium resize-none" />
                </div>
              </div>
              <motion.button onClick={handleBook} className="w-full mt-6 py-4 premium-button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                Send Booking Request
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
