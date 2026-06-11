import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  AlertTriangle, ChevronLeft, Upload, Send, CheckCircle, Clock,
  AlertCircle, DollarSign, Shield, Ban, MessageCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const reportTypes = [
  { id: 'non_payment', icon: DollarSign, label: 'Non-Payment', desc: 'Customer refused to pay agreed amount' },
  { id: 'wage_dispute', icon: AlertCircle, label: 'Wage Dispute', desc: 'Disagreement over payment amount' },
  { id: 'unsafe_environment', icon: Shield, label: 'Unsafe Environment', desc: 'Hazardous working conditions' },
  { id: 'harassment', icon: Ban, label: 'Harassment', desc: 'Verbal or physical harassment' },
  { id: 'other', icon: FileText, label: 'Other', desc: 'Any other safety concern' },
];

export default function SOSPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setSubmitting(true);
    const { error } = await supabase.from('sos_reports').insert({
      worker_id: user!.id,
      report_type: selectedType,
      description,
      location: location || null,
      status: 'pending',
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
            <CheckCircle className="w-8 h-8 text-trust-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Submitted</h2>
          <p className="text-gray-400 mb-6">
            Your safety report has been received. Our team will investigate and contact you within 24 hours.
          </p>
          <button
            onClick={() => navigate('/worker/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] via-[#12122a] to-[#0a0a14]" />
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emergency-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-emergency-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Worker SOS & Safety</h1>
            <p className="text-gray-400">Report safety issues & get support</p>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-emergency-500/10 border border-emergency-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-emergency-400" />
            <p className="text-sm text-emergency-300">
              For immediate emergencies, contact local authorities or call emergency services. This system is for reporting work-related issues.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">What happened?</h2>
            <div className="space-y-3">
              {reportTypes.map((type) => (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedType === type.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedType === type.id ? 'bg-primary-500/20' : 'bg-white/5'
                    }`}>
                      <type.icon className={`w-5 h-5 ${
                        selectedType === type.id ? 'text-primary-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium ${
                        selectedType === type.id ? 'text-white' : 'text-gray-300'
                      }`}>{type.label}</span>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Location (Optional)</h2>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Address or location description"
              className="w-full px-4 py-3 bg-[#0a0a14] border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-white placeholder:text-gray-600"
            />
          </div>

          {/* Description */}
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Describe what happened in detail..."
              className="w-full px-4 py-3 bg-[#0a0a14] border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-white placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedType || submitting}
            className="w-full py-4 bg-emergency-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-emergency-700 transition-colors"
          >
            {submitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
