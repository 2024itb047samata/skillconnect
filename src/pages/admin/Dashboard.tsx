import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Profile, WorkerDetails, Booking } from '../../types/database';
import { Users, UserCog, Briefcase, Calendar, Star, Shield, CheckCircle } from 'lucide-react';

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

  if (!profile || profile.role !== 'admin') return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2></div>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users and platform</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8">
          {[{ id: 'overview', label: 'Overview', icon: Users }, { id: 'users', label: 'Users', icon: Users }, { id: 'workers', label: 'Workers', icon: UserCog }].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${activeTab === t.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <t.icon className="w-5 h-5" />{t.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[{ label: 'Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
                { label: 'Workers', value: stats.totalWorkers, icon: UserCog, color: 'from-cyan-500 to-cyan-600' },
                { label: 'Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-green-500 to-green-600' }
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white" /></div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Workers</h2>
              <div className="space-y-3">
                {workers.slice(0, 5).map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div><p className="font-medium text-gray-900 dark:text-white">{w.profile.full_name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{w.skills.slice(0, 2).join(', ')}</p></div>
                    <div className="flex items-center"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="text-sm ml-1 text-gray-900 dark:text-white">{w.rating.toFixed(1)}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-200 dark:border-gray-700"><th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th><th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th><th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th><th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th><th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{u.full_name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'worker' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>{u.role}</span></td>
                      <td className="py-3 px-4">{u.is_verified ? (<span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Shield className="w-4 h-4" />Verified</span>) : (<span className="text-gray-500 dark:text-gray-400">Unverified</span>)}</td>
                      <td className="py-3 px-4"><button onClick={() => verifyUser(u.id, !u.is_verified)} className={`text-sm ${u.is_verified ? 'text-red-600 dark:text-red-400 hover:underline' : 'text-green-600 dark:text-green-400 hover:underline'}`}>{u.is_verified ? 'Remove Verify' : 'Verify'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((w) => (
              <div key={w.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{w.profile.full_name.charAt(0)}</span>
                  </div>
                  <div><h3 className="font-medium text-gray-900 dark:text-white">{w.profile.full_name}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{w.profile.location}</p></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">{w.skills.slice(0, 3).map((s) => (<span key={s} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">{s}</span>))}</div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="ml-1 font-medium text-gray-900 dark:text-white">{w.rating.toFixed(1)}</span></div>
                  <span className="text-gray-500 dark:text-gray-400">{w.completed_jobs} jobs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
