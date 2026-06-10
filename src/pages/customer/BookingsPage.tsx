import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Booking } from '../../types/database';
import { Calendar, Star, X } from 'lucide-react';

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

  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bookings</h1>
        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{(profile?.role === 'worker' ? b.customer : b.worker)?.full_name?.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{(profile?.role === 'worker' ? b.customer : b.worker)?.full_name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{b.notes}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[b.status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>{b.status}</span>
                    {profile?.role === 'worker' && b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(b.id, 'rejected')} className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Decline</button>
                        <button onClick={() => updateStatus(b.id, 'accepted')} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Accept</button>
                      </div>
                    )}
                    {profile?.role === 'worker' && b.status === 'accepted' && (
                      <button onClick={() => updateStatus(b.id, 'in_progress')} className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">Start</button>
                    )}
                    {profile?.role === 'worker' && b.status === 'in_progress' && (
                      <button onClick={() => updateStatus(b.id, 'completed')} className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Complete</button>
                    )}
                    {profile?.role === 'customer' && b.status === 'completed' && (
                      <button onClick={() => setShowReviewModal(b)} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg flex items-center gap-1 hover:bg-yellow-600"><Star className="w-4 h-4" />Review</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leave a Review</h3>
              <button onClick={() => setShowReviewModal(null)} className="text-gray-500 dark:text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setReviewData({ ...reviewData, rating: s })} className="p-1">
                  <Star className={`w-8 h-8 ${s <= reviewData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
                </button>
              ))}
            </div>
            <textarea value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })} rows={4} placeholder="Share your experience..." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl outline-none mb-4 resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            <button onClick={submitReview} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">Submit Review</button>
          </div>
        </div>
      )}
    </div>
  );
}
