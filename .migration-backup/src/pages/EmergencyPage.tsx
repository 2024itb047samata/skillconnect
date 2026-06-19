import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Clock, MapPin, Phone, Zap, Droplets, Flame, Wind, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const emergencyTypes = [
  { id: 'plumbing_leak', icon: Droplets, label: 'Plumbing Leak', color: 'from-blue-500 to-cyan-500' },
  { id: 'electrical', icon: Zap, label: 'Electrical Failure', color: 'from-amber-500 to-yellow-500' },
  { id: 'gas_leak', icon: Flame, label: 'Gas Leak', color: 'from-orange-500 to-red-500' },
  { id: 'hvac', icon: Wind, label: 'AC/Heating Issue', color: 'from-cyan-500 to-blue-500' },
];

export default function EmergencyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'critical' | 'high' | 'medium'>('high');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nearbyWorkers, setNearbyWorkers] = useState<any[]>([]);

  useEffect(() => {
    if (selectedType) {
      fetchNearbyWorkers();
    }
  }, [selectedType]);

  const fetchNearbyWorkers = async () => {
    const { data } = await supabase
      .from('worker_details')
      .select('*, profile:profiles(*)')
      .eq('emergency_available', true)
      .eq('availability_status', 'available')
      .limit(5);
    if (data) setNearbyWorkers(data as any[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setSubmitting(true);
    const { error } = await supabase.from('emergency_bookings').insert({
      customer_id: user!.id,
      emergency_type: selectedType,
      location,
      description,
      urgency_level: urgency,
      status: 'open',
    });

    setSubmitting(false);
    if (!error) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#12122a] border border-white/10 rounded-2xl p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-trust-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-trust-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Emergency Requested</h2>
          <p className="text-gray-400 mb-6">
            We've notified nearby emergency workers. Expected response time: 15-30 minutes.
          </p>
          <Link
            to={user ? '/customer/dashboard' : '/'}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl inline-block"
          >
            Continue
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] via-emergency-950/20 to-[#0a0a14]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emergency-500 flex items-center justify-center emergency-pulse">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Emergency Service</h1>
            <p className="text-gray-400">Get immediate help from nearby workers</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-emergency-500/10 border border-emergency-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-emergency-300">
            For life-threatening emergencies, call emergency services immediately. This service connects you with nearby workers for urgent repairs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emergency Type */}
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">What's the emergency?</h2>
            <div className="grid grid-cols-2 gap-3">
              {emergencyTypes.map((type) => (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    selectedType === type.id
                      ? 'border-emergency-500 bg-emergency-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${
                    selectedType === type.id ? 'text-white' : 'text-gray-400'
                  }`}>{type.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">How urgent is it?</h2>
            <div className="flex gap-3">
              {['critical', 'high', 'medium'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level as any)}
                  className={`flex-1 py-3 rounded-xl border-2 text-center capitalize transition-all ${
                    urgency === level
                      ? level === 'critical' ? 'border-red-500 bg-red-500/10 text-red-400' :
                        level === 'high' ? 'border-orange-500 bg-orange-500/10 text-orange-400' :
                        'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Your Location</h2>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Enter your address"
                className="w-full pl-12 pr-4 py-3 bg-[#0a0a14] border border-white/10 rounded-xl focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500 outline-none text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Brief Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the issue briefly..."
              className="w-full px-4 py-3 bg-[#0a0a14] border border-white/10 rounded-xl focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500 outline-none text-white placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedType || !location || submitting}
            className="w-full py-4 bg-emergency-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-emergency-700 transition-colors"
          >
            {submitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Finding Workers...
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                Request Emergency Help
              </>
            )}
          </button>
        </form>

        {/* Login prompt for non-authenticated users */}
        {!user && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-primary-600 font-bold rounded-xl inline-block"
            >
              Sign In for Faster Response
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
