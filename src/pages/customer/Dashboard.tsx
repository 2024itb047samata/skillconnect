import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { WorkerDetails } from '../../types/database';
import { Search, Star, MapPin, Clock, Briefcase, Calendar, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, CheckCircle } from 'lucide-react';

const skillIcons: Record<string, React.ElementType> = { Plumber: Wrench, Electrician: Zap, Painter: Paintbrush, Mason: Building2, Carpenter: Hammer, Mechanic: Car, Cleaner: Sparkles, 'AC Technician': Wind };

export default function CustomerDashboard() {
  const { user, profile } = useAuth();
  const [workers, setWorkers] = useState<WorkerDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchWorkers(); }, [user]);

  const fetchWorkers = async () => {
    const { data } = await supabase.from('worker_details').select('*, profile:profiles!worker_details_user_id_fkey(*)').eq('availability_status', 'available').gt('rating', 0).order('rating', { ascending: false }).limit(6);
    if (data) setWorkers(data as WorkerDetails[]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome, {profile?.full_name?.split(' ')[0]}!</h1>
          <p className="text-blue-100">Find skilled workers and manage your bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: 'Post a Job', icon: Briefcase, href: '/customer/post-job', color: 'from-blue-500 to-blue-600' },
            { label: 'Find Workers', icon: Search, href: '/search', color: 'from-cyan-500 to-cyan-600' },
            { label: 'My Bookings', icon: Calendar, href: '/customer/bookings', color: 'from-green-500 to-green-600' },
            { label: 'Messages', icon: MapPin, href: '/chat', color: 'from-orange-500 to-orange-600' }
          ].map((action, i) => (
            <Link key={i} to={action.href} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
            </Link>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Workers</h2>
            <Link to="/search" className="text-blue-600 dark:text-cyan-400 text-sm hover:underline">View all</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => {
              const Icon = worker.skills[0] && skillIcons[worker.skills[0]] ? skillIcons[worker.skills[0]] : Wrench;
              return (
                <Link key={worker.id} to={`/worker/${worker.user_id}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {worker.profile?.avatar_url ? (<img src={worker.profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />) : (<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center"><Icon className="w-8 h-8 text-white" /></div>)}
                      {worker.profile?.is_verified && (<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{worker.profile?.full_name}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1"><MapPin className="w-4 h-4 mr-1" />{worker.profile?.location || 'No location'}</div>
                      <div className="flex items-center mt-2"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="text-sm font-medium text-gray-900 dark:text-white ml-1">{worker.rating.toFixed(1)}</span><span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({worker.total_reviews})</span></div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {worker.skills.slice(0, 3).map((s) => (<span key={s} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">{s}</span>))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400"><Clock className="w-4 h-4 inline mr-1" />{worker.experience_years}y exp</span>
                    {worker.hourly_rate && (<span className="text-sm font-medium text-gray-900 dark:text-white">${worker.hourly_rate}/hr</span>)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
