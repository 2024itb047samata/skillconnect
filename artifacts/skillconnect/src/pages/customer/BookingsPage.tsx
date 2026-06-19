import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Booking } from '../../types/database';
import { Calendar, Star, X, CheckCircle, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BookingsPage() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState<Booking | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => { if (user) fetchBookings(); }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*, customer:profiles!bookings_customer_id_fkey(*), worker:profiles!bookings_worker_id_fkey(*)').eq(profile?.role === 'worker' ? 'worker_id' : 'customer_id', user!.id).order('created_at', { ascending: false });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchBookings();
  };

  const submitReview = async () => {
    if (!showReviewModal) return;
    await supabase.from('reviews').insert({ booking_id: showReviewModal.id, customer_id: user!.id, worker_id: showReviewModal.worker_id, rating: reviewData.rating, comment: reviewData.comment || null });
    setShowReviewModal(null);
    fetchBookings();
  };

  const statusConfig: Record<string, { bg: string; text: string; glow?: string }> = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    accepted: { bg: 'bg-primary-500/20', text: 'text-primary-400' },
    in_progress: { bg: 'bg-accent-500/20', text: 'text-accent-400' },
    completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    rejected: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-surface-400">Bookings</span>
          </div>
          <h1 className="text-3xl font-bold mb-8">
            Your <span className="text-gradient">Bookings</span>
          </h1>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 skeleton rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton w-1/4" />
                    <div className="h-3 skeleton w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-16 text-center"
          >
            <Calendar className="w-16 h-16 text-surface-600 mx-auto mb-4" />
            <p className="text-surface-400 text-lg">No bookings yet</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {bookings.map((b) => {
              const isWorker = profile?.role === 'worker';
              const otherPerson = isWorker ? b.customer : b.worker;

              return (
                <motion.div key={b.id} variants={itemVariants} className="glass-card p-6 group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow">
                        <span className="text-white font-bold text-lg">{otherPerson?.full_name?.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{otherPerson?.full_name}</h3>
                        <p className="text-sm text-surface-400 mt-1">{b.notes || 'No description'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-surface-500" />
                          <span className="text-xs text-surface-500">
                            {new Date(b.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusConfig[b.status]?.bg || 'bg-surface-700'} ${statusConfig[b.status]?.text || 'text-surface-300'}`}>
                        {b.status.replace('_', ' ')}
                      </span>

                      {/* Worker Actions */}
                      {isWorker && b.status === 'pending' && (
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => updateStatus(b.id, 'rejected')}
                            className="px-4 py-2 glass-button rounded-xl text-surface-300 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Decline
                          </motion.button>
                          <motion.button
                            onClick={() => updateStatus(b.id, 'accepted')}
                            className="px-4 py-2 premium-button text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Accept
                          </motion.button>
                        </div>
                      )}

                      {isWorker && b.status === 'accepted' && (
                        <motion.button
                          onClick={() => updateStatus(b.id, 'in_progress')}
                          className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-xl text-sm hover:bg-accent-500/30 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Start Job
                        </motion.button>
                      )}

                      {isWorker && b.status === 'in_progress' && (
                        <motion.button
                          onClick={() => updateStatus(b.id, 'completed')}
                          className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm hover:bg-emerald-500/30 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Mark Complete
                        </motion.button>
                      )}

                      {/* Customer Actions */}
                      {!isWorker && b.status === 'completed' && (
                        <motion.button
                          onClick={() => setShowReviewModal(b)}
                          className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl flex items-center gap-2 text-sm hover:bg-amber-500/30 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Star className="w-4 h-4" />
                          Leave Review
                        </motion.button>
                      )}

                      {!isWorker && b.status === 'completed' && (
                        <div className="flex items-center gap-2 text-surface-400 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Job Completed
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Leave a Review</h3>
                <button onClick={() => setShowReviewModal(null)} className="p-2 rounded-lg hover:bg-surface-800 transition-colors">
                  <X className="w-5 h-5 text-surface-400" />
                </button>
              </div>

              <div className="flex items-center gap-1 mb-6 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => setReviewData({ ...reviewData, rating: s })}
                    className="p-1"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star className={`w-10 h-10 transition-colors ${
                      s <= reviewData.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-700'
                    }`} />
                  </motion.button>
                ))}
              </div>

              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
                placeholder="Share your experience..."
                className="input-premium resize-none mb-6"
              />

              <motion.button
                onClick={submitReview}
                className="w-full py-3 premium-button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Submit Review
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
