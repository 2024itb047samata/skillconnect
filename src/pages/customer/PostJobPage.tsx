import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Briefcase, MapPin, DollarSign, Calendar, FileText, Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const skills = [
  { name: 'Plumber', icon: Wrench }, { name: 'Electrician', icon: Zap }, { name: 'Painter', icon: Paintbrush },
  { name: 'Mason', icon: Building2 }, { name: 'Carpenter', icon: Hammer }, { name: 'Mechanic', icon: Car },
  { name: 'Cleaner', icon: Sparkles }, { name: 'AC Technician', icon: Wind },
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

  if (success) return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors"><div className="text-center"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Posted!</h2></div></div>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Post a New Job</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">Service Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skills.map((s) => (
                <button key={s.name} type="button" onClick={() => setFormData({ ...formData, skill: s.name })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${formData.skill === s.name ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                  <s.icon className={`w-6 h-6 mx-auto mb-2 ${formData.skill === s.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${formData.skill === s.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Fix kitchen sink leak" className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white dark:placeholder-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} placeholder="Describe the work..." className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white dark:placeholder-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Downtown, New York" className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white dark:placeholder-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" value={formData.budget_min} onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })} className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" value={formData.budget_max} onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })} className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="date" value={formData.preferred_date} onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })} className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="flex justify-between">
            <Link to="/customer/dashboard" className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Cancel</Link>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Posting...</> : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
