import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Profile, WorkerDetails } from '../../types/database';
import { Users, UserCog, Briefcase, Calendar, Star, Shield, CheckCircle, TrendingUp, Zap, Database, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkers: 0, totalBookings: 0 });
  const [users, setUsers] = useState<Profile[]>([]);
  const [workers, setWorkers] = useState<(WorkerDetails & { profile: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'workers'>('overview');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: totalWorkers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'worker');
    const { count: totalBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    setStats({ totalUsers: totalUsers || 0, totalWorkers: totalWorkers || 0, totalBookings: totalBookings || 0 });
    const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(20);
    if (usersData) setUsers(usersData);
    const { data: workersData } = await supabase.from('worker_details').select('*, profile:profiles!worker_details_user_id_fkey(*)').order('rating', { ascending: false }).limit(20);
    if (workersData) setWorkers(workersData as (WorkerDetails & { profile: Profile })[]);
    setLoading(false);
  };

  const verifyUser = async (userId: string, verified: boolean) => {
    await supabase.from('profiles').update({ is_verified: verified }).eq('id', userId);
    fetchData();
  };

  if (!profile || profile.role !== 'admin') return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="glass-card p-8 text-center">
        <Shield className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-surface-400 mt-2">Admin access required</p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'workers' as const, label: 'Workers', icon: UserCog },
  ];

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-primary-500 to-primary-600', glow: 'shadow-glow-blue' },
    { label: 'Workers', value: stats.totalWorkers, icon: UserCog, color: 'from-cyan-500 to-cyan-600', glow: 'shadow-glow' },
    { label: 'Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-emerald-500 to-emerald-600', glow: 'shadow-glow' },
  ];

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-surface-800/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-surface-800/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-800/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-surface-400">Admin Panel</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-surface-400 text-lg">Manage users and platform</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8"
        >
          {tabs.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === t.id
                  ? 'premium-button'
                  : 'glass-button text-surface-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* DB Setup Banner — shown when no users exist yet */}
            {!loading && stats.totalUsers === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-8 border-amber-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">Database Setup Required</h3>
                    <p className="text-surface-400 text-sm mb-4">
                      No tables found. Run the setup SQL once in your{' '}
                      <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                        Supabase SQL Editor
                      </a>{' '}
                      to create all tables, RLS policies, and seed 10 demo workers.
                    </p>
                    <div className="bg-surface-900 rounded-xl p-4 border border-surface-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-surface-500 font-mono">File path</span>
                        <button
                          onClick={() => navigator.clipboard.writeText('artifacts/skillconnect/SETUP.sql')}
                          className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy path
                        </button>
                      </div>
                      <code className="text-sm text-amber-300 font-mono">artifacts/skillconnect/SETUP.sql</code>
                    </div>
                    <p className="text-xs text-surface-500 mt-3">
                      Seed account password: <span className="font-mono text-surface-300">SkillPass123</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
            >
              {statCards.map((s, i) => (
                <motion.div key={i} variants={itemVariants} className="glass-card p-6 group card-hover">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 ${s.glow} group-hover:scale-110 transition-transform`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gradient">{s.value}</div>
                  <div className="text-sm text-surface-400 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Top Workers</h2>
              </div>
              <div className="space-y-3">
                {workers.slice(0, 5).map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-4 bg-surface-800/50 rounded-xl group hover:bg-surface-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{w.profile.full_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{w.profile.full_name}</p>
                        <p className="text-xs text-surface-500">{w.skills.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-gradient">{w.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 overflow-x-auto"
          >
            <h2 className="text-lg font-bold text-white mb-6">All Users</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-400">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-white">{u.full_name}</td>
                    <td className="py-4 px-4 text-surface-400">{u.email}</td>
                    <td className="py-4 px-4">
                      <span className={`badge ${u.role === 'worker' ? 'badge-accent' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {u.is_verified ? (
                        <span className="flex items-center gap-2 text-emerald-400">
                          <Shield className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-surface-500">Unverified</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <motion.button
                        onClick={() => verifyUser(u.id, !u.is_verified)}
                        className={`text-sm font-medium ${
                          u.is_verified ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'
                        } transition-colors`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {u.is_verified ? 'Unverify' : 'Verify'}
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {workers.map((w) => (
              <motion.div key={w.id} variants={itemVariants} className="glass-card p-6 group card-hover">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow">
                    <span className="text-white font-bold">{w.profile.full_name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{w.profile.full_name}</h3>
                    <p className="text-sm text-surface-400">{w.profile.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {w.skills.slice(0, 3).map((s) => (
                    <span key={s} className="badge badge-primary">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm pt-4 border-t border-surface-800">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-white">{w.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-surface-400">{w.completed_jobs} jobs</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
