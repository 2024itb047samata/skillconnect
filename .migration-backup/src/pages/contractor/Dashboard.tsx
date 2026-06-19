import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Users, MapPin, Clock, DollarSign, CheckCircle, XCircle,
  UserPlus, Calendar, TrendingUp, Building2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContractorDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [activeSites, setActiveSites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const { data: teams } = await supabase
      .from('contractor_teams')
      .select('*, worker:profiles!contractor_teams_worker_id_fkey(*)')
      .eq('contractor_id', user!.id)
      .eq('is_active', true);
    if (teams) {
      setTeamMembers(teams);
      const sites = [...new Set(teams.map((t: any) => t.site_name).filter(Boolean))];
      setActiveSites(sites as string[]);
    }
    setLoading(false);
  };

  const searchWorkers = async () => {
    if (!searchQuery) return;
    const { data } = await supabase
      .from('profiles')
      .select('*, worker_details(*)')
      .eq('role', 'worker')
      .ilike('full_name', `%${searchQuery}%`)
      .limit(10);
    if (data) setSearchResults(data);
  };

  const addWorker = async (workerId: string, siteName: string, dailyWage: number) => {
    await supabase.from('contractor_teams').insert({
      contractor_id: user!.id,
      worker_id: workerId,
      site_name: siteName,
      daily_wage: dailyWage,
      is_active: true,
    });
    setShowAddModal(false);
    fetchData();
  };

  const removeWorker = async (teamId: string) => {
    await supabase.from('contractor_teams').update({ is_active: false }).eq('id', teamId);
    fetchData();
  };

  const stats = [
    { label: 'Team Size', value: teamMembers.length, icon: Users, color: 'from-primary-500 to-primary-600' },
    { label: 'Active Sites', value: activeSites.length, icon: Building2, color: 'from-accent-500 to-accent-600' },
    { label: 'Pending Wages', value: '₹0', icon: DollarSign, color: 'from-amber-500 to-amber-600' },
    { label: 'This Month Jobs', value: '0', icon: TrendingUp, color: 'from-trust-500 to-trust-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] via-[#12122a] to-[#0a0a14]" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-gray-400">Contractor Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">{profile?.full_name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-400 text-lg">Manage your workforce and sites</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#12122a] border border-white/10 rounded-2xl p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="bg-[#12122a] border border-white/10 rounded-xl p-4 flex flex-col items-center hover:border-primary-500/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="w-8 h-8 text-primary-400 mb-2" />
            <span className="font-medium text-white">Add Worker</span>
          </motion.button>

          <Link
            to="/search"
            className="bg-[#12122a] border border-white/10 rounded-xl p-4 flex flex-col items-center hover:border-primary-500/50 transition-all"
          >
            <Users className="w-8 h-8 text-accent-400 mb-2" />
            <span className="font-medium text-white">Find Workers</span>
          </Link>

          <Link
            to="/contractor/attendance"
            className="bg-[#12122a] border border-white/10 rounded-xl p-4 flex flex-col items-center hover:border-primary-500/50 transition-all"
          >
            <Clock className="w-8 h-8 text-trust-400 mb-2" />
            <span className="font-medium text-white">Attendance</span>
          </Link>

          <Link
            to="/contractor/wages"
            className="bg-[#12122a] border border-white/10 rounded-xl p-4 flex flex-col items-center hover:border-primary-500/50 transition-all"
          >
            <DollarSign className="w-8 h-8 text-amber-400 mb-2" />
            <span className="font-medium text-white">Wage Tracker</span>
          </Link>
        </div>

        {/* Team Members */}
        <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-400" />
              <h2 className="text-lg font-bold text-white">My Team</h2>
            </div>
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Worker
            </motion.button>
          </div>

          {teamMembers.length > 0 ? (
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a14] rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {member.worker?.full_name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{member.worker?.full_name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        {member.site_name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {member.site_name}
                          </span>
                        )}
                        {member.daily_wage && (
                          <span>₹{member.daily_wage}/day</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeWorker(member.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400">No team members yet</p>
              <p className="text-sm text-gray-500 mt-1">Add workers to your team to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#12122a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-white mb-4">Add Worker to Team</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workers by name..."
                className="w-full px-4 py-3 bg-[#0a0a14] border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white placeholder:text-gray-600"
              />
              <button
                onClick={searchWorkers}
                className="w-full py-2 bg-primary-600 text-white rounded-xl font-medium"
              >
                Search
              </button>
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-auto space-y-2">
                  {searchResults.map((worker) => (
                    <motion.button
                      key={worker.id}
                      onClick={() => addWorker(worker.id, 'Default Site', 500)}
                      className="w-full p-3 bg-[#0a0a14] rounded-lg text-left hover:bg-white/5 transition-colors"
                    >
                      <p className="text-white font-medium">{worker.full_name}</p>
                      <p className="text-xs text-gray-500">{worker.worker_details?.skills?.join(', ')}</p>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 py-2 border border-white/10 text-gray-400 rounded-xl"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
