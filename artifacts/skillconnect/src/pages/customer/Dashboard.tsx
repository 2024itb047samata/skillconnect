import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { WorkerDetails } from '../../types/database';
import { Search, Star, MapPin, Clock, Briefcase, Calendar, MessageSquare, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, Camera, Package, Heart, Settings, CheckCircle, ArrowRight, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const skillIcons: Record<string, React.ElementType> = {
  Plumber: Wrench, Electrician: Zap, Painter: Paintbrush, Mason: Building2,
  Carpenter: Hammer, Mechanic: Settings, Housekeeper: Sparkles, Cleaner: Sparkles,
  'AC Technician': Wind, 'CCTV Technician': Camera, Driver: Car,
  'Delivery Worker': Package, Caretaker: Heart,
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function CustomerDashboard() {
  const { user, profile } = useAuth();
  const [workers, setWorkers] = useState<WorkerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ workers: 0, jobs: 0, completed: 0 });

  useEffect(() => { if (user) { fetchWorkers(); fetchStats(); } }, [user]);

  const fetchWorkers = async () => {
    const { data } = await supabase
      .from('worker_details')
      .select('*, profile:profiles!worker_details_user_id_fkey(*)')
      .eq('availability_status', 'available')
      .order('rating', { ascending: false })
      .limit(6);
    if (data) setWorkers(data as WorkerDetails[]);
    setLoading(false);
  };

  const fetchStats = async () => {
    const [{ count: workerCount }, { count: jobCount }, { count: completedCount }] = await Promise.all([
      supabase.from('worker_details').select('id', { count: 'exact', head: true }).eq('availability_status', 'available'),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    ]);
    setStats({ workers: workerCount || 0, jobs: jobCount || 0, completed: completedCount || 0 });
  };

  const quickActions = [
    { label: 'Post a Job', icon: Briefcase, href: '/customer/post-job', color: 'from-primary-500 to-primary-600', glow: 'shadow-glow-blue' },
    { label: 'Find Workers', icon: Search, href: '/search', color: 'from-cyan-500 to-cyan-600', glow: 'shadow-glow' },
    { label: 'My Bookings', icon: Calendar, href: '/customer/bookings', color: 'from-emerald-500 to-emerald-600', glow: 'shadow-glow' },
    { label: 'Messages', icon: MessageSquare, href: '/chat', color: 'from-accent-500 to-accent-600', glow: 'shadow-glow-purple' },
  ];

  const platformStats = [
    { label: 'Workers Available', value: stats.workers, icon: Users, color: 'from-primary-500 to-primary-600' },
    { label: 'Open Jobs', value: stats.jobs, icon: Briefcase, color: 'from-amber-500 to-amber-600' },
    { label: 'Jobs Completed', value: stats.completed, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-surface-400">Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome, <span className="text-gradient">{profile?.full_name?.split(' ')[0]}</span>!
            </h1>
            <p className="text-surface-400 text-lg">Find skilled workers and manage your bookings</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {platformStats.map((s, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card p-5 text-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gradient">{s.value.toLocaleString()}</div>
              <div className="text-xs text-surface-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link to={action.href} className="glass-card group p-5 flex items-center gap-4 card-hover">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center ${action.glow} group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-white block">{action.label}</span>
                  <span className="text-xs text-surface-500 flex items-center gap-1 mt-1 group-hover:text-primary-400 transition-colors">
                    Get started <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Workers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Available Workers</h2>
            </div>
            <Link to="/search" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 skeleton rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 skeleton w-3/4" />
                      <div className="h-3 skeleton w-1/2" />
                      <div className="h-3 skeleton w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((worker) => {
                const Icon = worker.skills[0] && skillIcons[worker.skills[0]] ? skillIcons[worker.skills[0]] : Wrench;
                return (
                  <motion.div key={worker.id} variants={itemVariants}>
                    <Link to={`/worker/${worker.user_id}`} className="glass-card group p-6 block card-hover">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          {worker.profile?.avatar_url ? (
                            <img src={worker.profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-500/30 group-hover:ring-primary-500/60 transition-all" />
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
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">{worker.profile?.full_name}</h3>
                          <div className="flex items-center text-sm text-surface-400 mt-1">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{worker.profile?.location || 'No location'}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-medium text-white ml-1">{worker.rating.toFixed(1)}</span>
                            <span className="text-xs text-surface-500 ml-1">({worker.total_reviews})</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {worker.skills.slice(0, 3).map((s) => (<span key={s} className="badge badge-primary">{s}</span>))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-surface-800 flex items-center justify-between">
                        <span className="text-sm text-surface-400"><Clock className="w-4 h-4 inline mr-1" />{worker.experience_years}y exp</span>
                        {worker.hourly_rate && (<span className="text-sm font-medium text-gradient">₹{worker.hourly_rate}/hr</span>)}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
