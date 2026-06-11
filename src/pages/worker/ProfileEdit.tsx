import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Phone, MapPin, Clock, DollarSign, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, CheckCircle, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const skills = [
  { name: 'Plumber', icon: Wrench, color: 'from-blue-500 to-cyan-400' },
  { name: 'Electrician', icon: Zap, color: 'from-amber-500 to-yellow-400' },
  { name: 'Painter', icon: Paintbrush, color: 'from-rose-500 to-pink-400' },
  { name: 'Mason', icon: Building2, color: 'from-orange-500 to-red-400' },
  { name: 'Carpenter', icon: Hammer, color: 'from-amber-600 to-orange-400' },
  { name: 'Mechanic', icon: Car, color: 'from-slate-500 to-gray-400' },
  { name: 'Cleaner', icon: Sparkles, color: 'from-emerald-500 to-teal-400' },
  { name: 'AC Technician', icon: Wind, color: 'from-cyan-500 to-blue-400' },
];

export default function WorkerProfileEdit() {
  const { user, workerDetails, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({ full_name: '', phone: '', location: '' });
  const [workerData, setWorkerData] = useState({ skills: [] as string[], experience_years: 0, hourly_rate: '', daily_rate: '', bio: '', availability_status: 'available' as 'available' | 'busy' | 'offline' });

  useEffect(() => { if (user && workerDetails) loadProfile(); }, [user, workerDetails]);

  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
    if (data) setProfileData({ full_name: data.full_name || '', phone: data.phone || '', location: data.location || '' });
    if (workerDetails) setWorkerData({ skills: workerDetails.skills || [], experience_years: workerDetails.experience_years || 0, hourly_rate: workerDetails.hourly_rate?.toString() || '', daily_rate: workerDetails.daily_rate?.toString() || '', bio: workerDetails.bio || '', availability_status: workerDetails.availability_status || 'available' });
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('profiles').update({ full_name: profileData.full_name, phone: profileData.phone, location: profileData.location, updated_at: new Date().toISOString() }).eq('id', user!.id);
    await supabase.from('worker_details').update({ skills: workerData.skills, experience_years: workerData.experience_years, hourly_rate: workerData.hourly_rate ? parseFloat(workerData.hourly_rate) : null, daily_rate: workerData.daily_rate ? parseFloat(workerData.daily_rate) : null, bio: workerData.bio, availability_status: workerData.availability_status }).eq('user_id', user!.id);
    await refreshProfile();
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  const toggleSkill = (skill: string) => {
    setWorkerData((prev) => ({ ...prev, skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill] }));
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-950 text-white py-8">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-surface-400">Profile Settings</span>
          </div>
          <h1 className="text-3xl font-bold mb-8">
            Edit <span className="text-gradient">Profile</span>
          </h1>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Basic Info</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-lg">{profileData.full_name}</p>
                  <p className="text-sm text-surface-400">Profile photo</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="input-premium pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="input-premium pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="input-premium pl-12"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills & Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Skills & Services</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {skills.map((s) => (
                <motion.button
                  key={s.name}
                  type="button"
                  onClick={() => toggleSkill(s.name)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    workerData.skills.includes(s.name)
                      ? 'border-primary-500 bg-primary-500/10 shadow-glow'
                      : 'border-surface-700 hover:border-surface-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${workerData.skills.includes(s.name) ? 'text-primary-400' : 'text-surface-300'}`}>
                    {s.name}
                  </span>
                </motion.button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Years of Experience</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="number"
                  value={workerData.experience_years}
                  onChange={(e) => setWorkerData({ ...workerData, experience_years: parseInt(e.target.value) || 0 })}
                  className="input-premium pl-12"
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Hourly Rate</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    type="number"
                    value={workerData.hourly_rate}
                    onChange={(e) => setWorkerData({ ...workerData, hourly_rate: e.target.value })}
                    className="input-premium pl-12 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500">/hr</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Daily Rate</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                  <input
                    type="number"
                    value={workerData.daily_rate}
                    onChange={(e) => setWorkerData({ ...workerData, daily_rate: e.target.value })}
                    className="input-premium pl-12 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500">/day</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">About</h2>
            <textarea
              value={workerData.bio}
              onChange={(e) => setWorkerData({ ...workerData, bio: e.target.value })}
              rows={5}
              placeholder="Tell customers about yourself..."
              className="input-premium resize-none mb-6"
            />
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-3">Availability</label>
              <div className="grid grid-cols-3 gap-3">
                {['available', 'busy', 'offline'].map((status) => (
                  <motion.button
                    key={status}
                    type="button"
                    onClick={() => setWorkerData({ ...workerData, availability_status: status as 'available' | 'busy' | 'offline' })}
                    className={`p-3 rounded-xl border-2 text-center capitalize transition-all ${
                      workerData.availability_status === status
                        ? status === 'available'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : status === 'busy'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-surface-600 bg-surface-700/50 text-surface-300'
                        : 'border-surface-700 hover:border-surface-600 text-surface-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={saving}
            className="w-full py-4 premium-button flex items-center justify-center gap-2 text-lg"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
