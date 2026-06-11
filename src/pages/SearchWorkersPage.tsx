import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { WorkerDetails } from '../types/database';
import { Search, Star, MapPin, Clock, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const skillIcons: Record<string, React.ElementType> = { Plumber: Wrench, Electrician: Zap, Painter: Paintbrush, Mason: Building2, Carpenter: Hammer, Mechanic: Car, Cleaner: Sparkles, 'AC Technician': Wind };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header with Search */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary-400" />
              <span className="text-sm text-surface-400">Find Workers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Discover <span className="text-gradient">Skilled Professionals</span>
            </h1>
            <p className="text-surface-400 text-lg mb-8">
              Browse verified workers by service type and location
            </p>

            {/* Search Bar */}
            <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full pl-12 pr-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-white placeholder:text-surface-500 transition-all"
                />
              </div>
              <div className="relative sm:w-48">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-white appearance-none cursor-pointer"
                >
                  <option value="">All Services</option>
                  {allSkills.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-surface-400">
            <span className="text-white font-medium">{filtered.length}</span> workers found
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 skeleton rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton w-3/4" />
                    <div className="h-3 skeleton w-1/2" />
                    <div className="h-3 skeleton w-1/4" />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-6 skeleton w-16 rounded-full" />
                  <div className="h-6 skeleton w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
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
                    className="glass-card group p-6 block card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        {worker.profile?.avatar_url ? (
                          <img
                            src={worker.profile.avatar_url}
                            alt=""
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-500/30 group-hover:ring-primary-500/60 transition-all"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        )}
                        {worker.profile?.is_verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-surface-900 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {worker.profile?.full_name}
                        </h3>
                        <div className="flex items-center text-sm text-surface-400 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {worker.profile?.location || 'No location'}
                        </div>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-white ml-1">{worker.rating.toFixed(1)}</span>
                          <span className="text-xs text-surface-500 ml-1">({worker.total_reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {worker.skills.slice(0, 3).map((s) => (
                        <span key={s} className="badge badge-primary">{s}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-surface-800 flex items-center justify-between">
                      <span className="text-sm text-surface-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {worker.experience_years}y exp
                      </span>
                      {worker.hourly_rate && (
                        <span className="text-sm font-medium text-gradient">${worker.hourly_rate}/hr</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-surface-600" />
            <p className="text-surface-400 text-lg">No workers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
