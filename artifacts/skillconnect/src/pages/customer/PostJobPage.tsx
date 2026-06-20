import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Briefcase, MapPin, IndianRupee, Calendar, FileText, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, Camera, Package, Heart, Settings, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const skills = [
  { name: 'Plumber', icon: Wrench, color: 'from-blue-500 to-cyan-400' },
  { name: 'Electrician', icon: Zap, color: 'from-amber-500 to-yellow-400' },
  { name: 'Carpenter', icon: Hammer, color: 'from-amber-600 to-orange-400' },
  { name: 'Painter', icon: Paintbrush, color: 'from-rose-500 to-pink-400' },
  { name: 'Housekeeper', icon: Sparkles, color: 'from-emerald-500 to-teal-400' },
  { name: 'AC Technician', icon: Wind, color: 'from-cyan-500 to-blue-400' },
  { name: 'CCTV Technician', icon: Camera, color: 'from-slate-500 to-gray-400' },
  { name: 'Mason', icon: Building2, color: 'from-orange-500 to-red-400' },
  { name: 'Driver', icon: Car, color: 'from-violet-500 to-purple-400' },
  { name: 'Mechanic', icon: Settings, color: 'from-zinc-500 to-gray-400' },
  { name: 'Caretaker', icon: Heart, color: 'from-pink-500 to-rose-400' },
  { name: 'Delivery Worker', icon: Package, color: 'from-green-500 to-emerald-400' },
];

export default function PostJobPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', skill: '', budget_min: '', budget_max: '', location: '', preferred_date: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.skill || !formData.location) return;
    setLoading(true);
    const { error } = await supabase.from('jobs').insert({
      customer_id: user!.id, title: formData.title, description: formData.description, skill: formData.skill,
      budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
      budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
      location: formData.location, preferred_date: formData.preferred_date || null, status: 'open',
    });
    setLoading(false);
    if (!error) { setSuccess(true); setTimeout(() => navigate('/customer/jobs'), 1500); }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white py-8">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.4)]">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Job Posted!</h2>
              <p className="text-surface-400 mt-2">Redirecting to your jobs...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-surface-400">Post a Job</span>
          </div>
          <h1 className="text-3xl font-bold mb-8">
            Create a <span className="text-gradient">New Job</span>
          </h1>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-white mb-4">Service Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skills.map((s) => (
                <motion.button
                  key={s.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, skill: s.name })}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    formData.skill === s.name
                      ? 'border-primary-500 bg-primary-500/10 shadow-glow'
                      : 'border-surface-700 hover:border-surface-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-9 h-9 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-xs font-medium leading-tight ${formData.skill === s.name ? 'text-primary-400' : 'text-surface-300'}`}>
                    {s.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Job Title *</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Fix kitchen pipe leak"
                className="input-premium pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Description *</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3 w-5 h-5 text-surface-500" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Describe the work needed..."
                className="input-premium pl-12 resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Salt Lake, Kolkata"
                className="input-premium pl-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Min Budget (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                  placeholder="500"
                  className="input-premium pl-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Max Budget (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                  placeholder="2000"
                  className="input-premium pl-12"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Preferred Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="date"
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                className="input-premium pl-12"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Link to="/customer/dashboard" className="px-6 py-3 text-surface-400 hover:text-white transition-colors">
              Cancel
            </Link>
            <motion.button
              type="submit"
              disabled={loading || !formData.skill || !formData.title || !formData.location}
              className="premium-button px-8 py-3 flex items-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Posting...</>) : 'Post Job'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
