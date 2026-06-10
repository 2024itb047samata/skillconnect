import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { WorkerDetails } from '../types/database';
import { Search, Star, MapPin, Clock, Briefcase, Calendar, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, CheckCircle } from 'lucide-react';

const skillIcons: Record<string, React.ElementType> = { Plumber: Wrench, Electrician: Zap, Painter: Paintbrush, Mason: Building2, Carpenter: Hammer, Mechanic: Car, Cleaner: Sparkles, 'AC Technician': Wind };

export default function SearchWorkersPage() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState<WorkerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    const { data } = await supabase.from('worker_details').select('*, profile:profiles!worker_details_user_id_fkey(*)').gt('rating', 0).order('rating', { ascending: false }).limit(20);
    if (data) setWorkers(data as WorkerDetails[]);
    setLoading(false);
  };

  const filtered = workers.filter((w) => {
    const matchesSearch = !searchQuery || w.profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = !selectedSkill || w.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const allSkills = Array.from(new Set(workers.flatMap((w) => w.skills)));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Find Workers</h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name..." className="w-full pl-10 pr-4 py-3 text-gray-900 dark:text-white rounded-lg border-0 focus:ring-0 outline-none bg-transparent dark:placeholder-gray-400" />
            </div>
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="px-4 py-3 text-gray-900 dark:text-white rounded-lg border-0 bg-gray-50 dark:bg-gray-700">
              <option value="">All Services</option>
              {allSkills.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map((i) => (<div key={i} className="bg-white dark:bg-gray-800 rounded-xl animate-pulse p-6"><div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" /></div>))}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((worker) => {
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
        )}
      </div>
    </div>
  );
}
