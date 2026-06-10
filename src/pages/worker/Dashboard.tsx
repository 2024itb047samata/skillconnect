import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Booking, Job, Review } from '../../types/database';
import { Briefcase, Calendar, Star, Clock, CheckCircle, MapPin, MessageSquare, Settings, X } from 'lucide-react';

export default function WorkerDashboard() {
  const { user, profile, workerDetails } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState<Booking | null>(null);
  const [localStatus, setLocalStatus] = useState(workerDetails?.availability_status || 'available');

  useEffect(() => { if (user && workerDetails) { fetchData(); setLocalStatus(workerDetails.availability_status); } }, [user, workerDetails]);

  const fetchData = async () => {
    const { data: bookingsData } = await supabase.from('bookings').select('*, customer:profiles!bookings_customer_id_fkey(*)').eq('worker_id', user!.id).order('created_at', { ascending: false }).limit(10);
    if (bookingsData) setBookings(bookingsData as Booking[]);
    if (workerDetails?.skills.length) {
      const { data: jobsData } = await supabase.from('jobs').select('*').eq('status', 'open').limit(10);
      if (jobsData) setAvailableJobs((jobsData as Job[]).filter((j) => workerDetails.skills.includes(j.skill)));
    }
    const { data: reviewsData } = await supabase.from('reviews').select('*, customer:profiles(*)').eq('worker_id', user!.id).order('created_at', { ascending: false }).limit(5);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome, {profile?.full_name?.split(' ')[0]}!</h1>
              <p className="text-cyan-100">Manage your bookings</p>
            </div>
            <button onClick={() => setShowStatusModal(true)}
              className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${localStatus === 'available' ? 'bg-green-400' : localStatus === 'busy' ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-400'}`}>
              <span className={`w-2 h-2 rounded-full ${localStatus === 'available' ? 'bg-white animate-pulse' : 'bg-white/50'}`} />
              {localStatus}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{ label: 'Jobs', value: workerDetails?.completed_jobs || 0, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
            { label: 'Rating', value: workerDetails?.rating?.toFixed(1) || '0.0', icon: Star, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Reviews', value: workerDetails?.total_reviews || 0, icon: MessageSquare, color: 'from-green-500 to-green-600' },
            { label: 'Experience', value: `${workerDetails?.experience_years || 0}y`, icon: Clock, color: 'from-purple-500 to-purple-600' }
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}><s.icon className="w-6 h-6 text-white" /></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/worker/profile" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-md transition-shadow">
            <Settings className="w-8 h-8 text-blue-600 mb-2" /><span className="font-medium text-gray-900 dark:text-white">Edit Profile</span>
          </Link>
          <Link to="/worker/bookings" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-md transition-shadow">
            <Calendar className="w-8 h-8 text-green-600 mb-2" /><span className="font-medium text-gray-900 dark:text-white">Bookings</span>
          </Link>
          <Link to="/chat" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-md transition-shadow">
            <MessageSquare className="w-8 h-8 text-purple-600 mb-2" /><span className="font-medium text-gray-900 dark:text-white">Messages</span>
          </Link>
          <Link to="/search" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-md transition-shadow">
            <Briefcase className="w-8 h-8 text-cyan-600 mb-2" /><span className="font-medium text-gray-900 dark:text-white">Find Jobs</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Requests {pendingBookings.length > 0 && <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm rounded-full">{pendingBookings.length}</span>}</h2>
          </div>
          {pendingBookings.length > 0 ? (
            <div className="space-y-4">
              {pendingBookings.map((b) => (
                <div key={b.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{b.customer?.full_name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{b.customer?.full_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{b.notes || 'No description'}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowBookingModal(b)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg">View</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (<div className="text-center py-12 text-gray-500 dark:text-gray-400"><CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" /><p>No pending requests</p></div>)}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Matching Jobs</h2>
            {availableJobs.length > 0 ? (
              <div className="space-y-3">{availableJobs.slice(0, 4).map((j) => (
                <div key={j.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{j.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{j.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400"><MapPin className="w-3 h-3 inline mr-1" />{j.location}</span>
                    {j.budget_min && <span className="text-xs font-medium text-green-600">${j.budget_min}</span>}
                  </div>
                </div>
              ))}</div>
            ) : (<p className="text-center text-gray-500 dark:text-gray-400 py-4">No matching jobs</p>)}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">{reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900 dark:text-white">{r.customer?.full_name}</span>
                    <div className="flex items-center">{[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />))}</div>
                  </div>
                  {r.comment && (<p className="text-sm text-gray-600 dark:text-gray-400">"{r.comment}"</p>)}
                </div>
              ))}</div>
            ) : (<p className="text-center text-gray-500 dark:text-gray-400 py-4">No reviews yet</p>)}
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between mb-6"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Status</h3><button onClick={() => setShowStatusModal(false)}><X className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button></div>
            <div className="space-y-3">
              {['available', 'busy', 'offline'].map((status) => (
                <button key={status} onClick={() => setLocalStatus(status as 'available' | 'busy' | 'offline')}
                  className={`w-full p-4 rounded-xl border-2 text-left ${localStatus === status ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${status === 'available' ? 'bg-green-500' : status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    <span className="font-medium capitalize text-gray-900 dark:text-white">{status}</span>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={updateStatus} className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-xl">Update Status</button>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between mb-6"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Booking Request</h3><button onClick={() => setShowBookingModal(null)}><X className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button></div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-4">
              <p className="font-medium text-gray-900 dark:text-white">{showBookingModal.customer?.full_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{showBookingModal.notes}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => updateBooking(showBookingModal.id, 'rejected')} className="py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium">Decline</button>
              <button onClick={() => updateBooking(showBookingModal.id, 'accepted')} className="py-3 bg-blue-600 text-white font-semibold rounded-xl">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
