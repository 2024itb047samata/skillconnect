import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Phone, MapPin, Clock, DollarSign, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, CheckCircle, Loader2, Camera, Save } from 'lucide-react';

const skills = [
  { name: 'Plumber', icon: Wrench }, { name: 'Electrician', icon: Zap }, { name: 'Painter', icon: Paintbrush },
  { name: 'Mason', icon: Building2 }, { name: 'Carpenter', icon: Hammer }, { name: 'Mechanic', icon: Car },
  { name: 'Cleaner', icon: Sparkles }, { name: 'AC Technician', icon: Wind },
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

  if (loading) return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Profile</h1>
        {success && (<div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2 text-green-600 dark:text-green-400"><CheckCircle className="w-5 h-5" /><span>Profile updated!</span></div>)}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Info</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div><p className="font-medium text-gray-900 dark:text-white">{profileData.full_name}</p><p className="text-sm text-gray-500 dark:text-gray-400">Upload a profile photo</p></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Skills & Services</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {skills.map((s) => (
                <button key={s.name} type="button" onClick={() => toggleSkill(s.name)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${workerData.skills.includes(s.name) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                  <s.icon className={`w-6 h-6 mx-auto mb-2 ${workerData.skills.includes(s.name) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${workerData.skills.includes(s.name) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{s.name}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Years of Experience</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" value={workerData.experience_years} onChange={(e) => setWorkerData({ ...workerData, experience_years: parseInt(e.target.value) || 0 })} className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hourly Rate</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={workerData.hourly_rate} onChange={(e) => setWorkerData({ ...workerData, hourly_rate: e.target.value })} className="w-full pl-10 pr-16 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">/hr</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Daily Rate</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={workerData.daily_rate} onChange={(e) => setWorkerData({ ...workerData, daily_rate: e.target.value })} className="w-full pl-10 pr-16 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">/day</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">About</h2>
            <textarea value={workerData.bio} onChange={(e) => setWorkerData({ ...workerData, bio: e.target.value })} rows={5} placeholder="Tell customers about yourself..." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white dark:placeholder-gray-400" />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Availability</label>
              <div className="grid grid-cols-3 gap-3">
                {['available', 'busy', 'offline'].map((status) => (
                  <button key={status} type="button" onClick={() => setWorkerData({ ...workerData, availability_status: status as 'available' | 'busy' | 'offline' })}
                    className={`p-3 rounded-xl border-2 text-center capitalize transition-all ${workerData.availability_status === status ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'}`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
