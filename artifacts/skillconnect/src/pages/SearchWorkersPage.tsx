import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { WorkerDetails } from '../types/database';
import { Search, Star, MapPin, Clock, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, CheckCircle, SlidersHorizontal, Camera, Package, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const skillIcons: Record<string, React.ElementType> = {
  Plumber: Wrench,
  Electrician: Zap,
  Painter: Paintbrush,
  Mason: Building2,
  Carpenter: Hammer,
  Mechanic: Car,
  Housekeeper: Sparkles,
  Cleaner: Sparkles,
  'AC Technician': Wind,
  'CCTV Technician': Camera,
  Driver: Car,
  'Delivery Worker': Package,
  Caretaker: Heart,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SearchWorkersPage() {
  const [workers, setWorkers] = useState<WorkerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('worker_details')
      .select('*, profile:profiles!worker_details_user_id_fkey(*)')
      .order('rating', { ascending: false })
      .limit(100);
    if (data) setWorkers(data as WorkerDetails[]);
    setLoading(false);
  };

  const filtered = workers.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      w.profile?.full_name?.toLowerCase().includes(q) ||
      w.skills.some((s) => s.toLowerCase().includes(q)) ||
      w.profile?.location?.toLowerCase().includes(q);
    const matchesSkill = !selectedSkill || w.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const allSkills = Array.from(new Set(workers.flatMap((w) => w.skills))).sort();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-surface-950 text-gray-900 dark:text-white transition-colors">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:bg-hero-gradient dark:opacity-30 transition-colors" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary-200/50 dark:bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent-200/50 dark:bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-transparent to-accent-100 dark:from-primary-600/20 dark:via-transparent dark:to-accent-600/10 transition-colors" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Find Workers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Skilled Professionals</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Browse verified workers across India — electricians, plumbers, carpenters and more
            </p>

            <div className="bg-white dark:bg-[#12122a] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm dark:shadow-none flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search electricians, plumbers, carpenters..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-surface-800/50 border border-gray-300 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                />
              </div>
              <div className="relative sm:w-52">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-surface-800/50 border border-gray-300 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">All Services</option>
                  {allSkills.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="text-gray-900 dark:text-white font-medium">{filtered.length}</span> workers found
            {searchQuery && <span className="ml-1">for "<span className="text-primary-600 dark:text-primary-400">{searchQuery}</span>"</span>}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-[#12122a] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No workers found matching your search</p>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-2">Try searching for "electrician", "plumber", or a city like "Kolkata"</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((worker) => {
              const Icon = worker.skills[0] && skillIcons[worker.skills[0]] ? skillIcons[worker.skills[0]] : Wrench;
              return (
                <motion.div key={worker.id} variants={itemVariants}>
                  <Link
                    to={`/worker/${worker.user_id}`}
                    className="bg-white dark:bg-[#12122a] group p-6 block border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        {worker.profile?.avatar_url ? (
                          <img
                            src={worker.profile.avatar_url}
                            alt=""
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-500/30 group-hover:ring-primary-400 dark:group-hover:ring-primary-500/60 transition-all"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-md dark:shadow-glow group-hover:shadow-lg dark:group-hover:shadow-glow-lg transition-shadow">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        )}
                        {worker.profile?.is_verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-surface-900 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                          {worker.profile?.full_name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{worker.profile?.location || 'No location'}</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">{worker.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({worker.total_reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {worker.skills.slice(0, 3).map((s) => (
                        <span key={s} className="px-3 py-1 bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/30 rounded-full text-xs font-medium">{s}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-surface-800 flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {worker.experience_years}y exp
                      </span>
                      {worker.hourly_rate && (
                        <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">₹{worker.hourly_rate}/hr</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
