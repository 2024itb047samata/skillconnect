import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { WorkerDetails, Profile, Review } from '../types/database';
import { Star, MapPin, Clock, CheckCircle, Calendar, MessageSquare, Shield, Briefcase, ChevronLeft, Send, X, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind } from 'lucide-react';

interface WorkerWithProfile extends WorkerDetails { profile: Profile }
const skillIcons: Record<string, React.ElementType> = { Plumber: Wrench, Electrician: Zap, Painter: Paintbrush, Mason: Building2, Carpenter: Hammer, Mechanic: Car, Cleaner: Sparkles, 'AC Technician': Wind };

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
    const { data } = await supabase.from('worker_details').select('*, profile:profiles!worker_details_user_id_fkey(*)').eq('user_id', workerId).single();
    if (data) { setWorker(data as WorkerWithProfile); const { data: reviewsData } = await supabase.from('reviews').select('*, customer:profiles(*)').eq('worker_id', workerId).order('created_at', { ascending: false }).limit(10); if (reviewsData) setReviews(reviewsData as Review[]); }
    setLoading(false);
  };

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    await supabase.from('bookings').insert({ customer_id: user.id, worker_id: worker!.user_id, scheduled_date: bookingData.scheduled_date || null, notes: bookingData.notes || null, status: 'pending' });
    setShowBookModal(false);
    navigate('/customer/bookings');
  };

  if (loading) return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>);
  if (!worker) return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Worker not found</h2></div>);

  const Icon = worker.skills[0] && skillIcons[worker.skills[0]] ? skillIcons[worker.skills[0]] : Wrench;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"><ChevronLeft className="w-5 h-5" />Back</button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {worker.profile.avatar_url ? (<img src={worker.profile.avatar_url} alt="" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />) : (<div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white"><Icon className="w-16 h-16 text-white" /></div>)}
              {worker.availability_status === 'available' && (<div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{worker.profile.full_name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{worker.profile.location || 'No location'}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{worker.experience_years}y exp</span>
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{worker.completed_jobs} jobs</span>
              </div>
              <div className="flex items-center gap-2 mt-2"><Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /><span className="text-xl font-bold">{worker.rating.toFixed(1)}</span><span>({worker.total_reviews} reviews)</span></div>
              <div className="flex flex-wrap gap-2 mt-4">{worker.skills.map((s) => (<span key={s} className="px-3 py-1 bg-white/20 rounded-full text-sm">{s}</span>))}</div>
            </div>
            {user?.id !== worker.user_id && (
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button onClick={() => setShowBookModal(true)} className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-lg transition-all">Book Now</button>
                <button onClick={() => navigate(`/chat/${worker.user_id}`)} className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center justify-center gap-2"><MessageSquare className="w-5 h-5" />Message</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-400">{worker.bio || 'No description provided.'}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">{reviews.map((r) => (
                  <div key={r.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{r.customer?.full_name}</span>
                      <div className="flex items-center">{[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />))}</div>
                    </div>
                    {r.comment && (<p className="text-sm text-gray-600 dark:text-gray-400">"{r.comment}"</p>)}
                  </div>
                ))}</div>
              ) : (<p className="text-center text-gray-500 dark:text-gray-400 py-4">No reviews yet</p>)}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Availability</h3>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${worker.availability_status === 'available' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : worker.availability_status === 'busy' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                <span className={`w-2 h-2 rounded-full ${worker.availability_status === 'available' ? 'bg-green-500 animate-pulse' : worker.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                {worker.availability_status}
              </div>
            </div>
            {(worker.hourly_rate || worker.daily_rate) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Pricing</h3>
                <div className="space-y-2">
                  {worker.hourly_rate && (<div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Hourly</span><span className="font-bold text-gray-900 dark:text-white">${worker.hourly_rate}/hr</span></div>)}
                  {worker.daily_rate && (<div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Daily</span><span className="font-bold text-gray-900 dark:text-white">${worker.daily_rate}/day</span></div>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between mb-6"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Book {worker.profile.full_name}</h3><button onClick={() => setShowBookModal(false)}><X className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Date</label><input type="date" value={bookingData.scheduled_date} onChange={(e) => setBookingData({ ...bookingData, scheduled_date: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label><textarea value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} rows={4} placeholder="Describe the work needed..." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white dark:placeholder-gray-400" /></div>
            </div>
            <button onClick={handleBook} className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl">Send Booking Request</button>
          </div>
        </div>
      )}
    </div>
  );
}
