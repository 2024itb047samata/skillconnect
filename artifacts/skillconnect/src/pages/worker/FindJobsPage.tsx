import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Job, JobApplication } from '../../types/database';
import { Search, MapPin, IndianRupee, Clock, Briefcase, CheckCircle, SlidersHorizontal, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function FindJobsPage() {
  const { user, workerDetails } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: jobsData }, { data: appsData }] = await Promise.all([
      supabase.from('jobs').select('*, customer:profiles!jobs_customer_id_fkey(full_name, location)').eq('status', 'open').order('created_at', { ascending: false }).limit(100),
      supabase.from('job_applications').select('*').eq('worker_id', user!.id),
    ]);
    if (jobsData) setJobs(jobsData as Job[]);
    if (appsData) setApplications(appsData as JobApplication[]);
    setLoading(false);
  };

  const appliedJobIds = new Set(applications.map((a) => a.job_id));

  const filtered = jobs.filter((j) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      j.title.toLowerCase().includes(q) ||
      j.skill.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q);
    const matchesSkill = !selectedSkill || j.skill === selectedSkill;
    return matchesSearch && matchesSkill;
  });

  const allSkills = Array.from(new Set(jobs.map((j) => j.skill))).sort();

  const getApplicationStatus = (jobId: string) => applications.find((a) => a.job_id === jobId)?.status;

  const handleApply = async () => {
    if (!applyingJob || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from('job_applications').insert({
      job_id: applyingJob.id,
      worker_id: user.id,
      cover_note: coverNote.trim() || null,
      status: 'pending',
    });
    setSubmitting(false);
    if (!error) {
      setSuccessId(applyingJob.id);
      setApplications((prev) => [...prev, { id: '', job_id: applyingJob.id, worker_id: user.id, status: 'pending', created_at: new Date().toISOString() }]);
      setApplyingJob(null);
      setCoverNote('');
      setTimeout(() => setSuccessId(null), 3000);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-transparent to-primary-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-surface-400">Job Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary-400">Available Jobs</span>
            </h1>
            <p className="text-surface-400 text-lg mb-8">Browse job postings from clients across India</p>

            <div className="bg-[#12122a] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by skill, city, or keyword..."
                  className="w-full pl-12 pr-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white placeholder:text-gray-500"
                />
              </div>
              <div className="relative sm:w-52">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {allSkills.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-surface-400">
            <span className="text-white font-medium">{filtered.length}</span> jobs found
            {workerDetails?.skills?.length ? (
              <span className="ml-2 text-sm text-cyan-400">
                — {applications.length} applied
              </span>
            ) : null}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 space-y-3">
                <div className="h-5 skeleton w-3/4" />
                <div className="h-4 skeleton w-1/2" />
                <div className="h-4 skeleton w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-surface-600" />
            <p className="text-surface-400 text-lg font-medium">No jobs found matching your search</p>
            <p className="text-surface-600 text-sm mt-2">Try searching for "electrician", "plumber", or a city like "Mumbai"</p>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => {
              const appStatus = getApplicationStatus(job.id);
              return (
                <motion.div key={job.id} variants={itemVariants}>
                  <div className={`glass-card p-6 flex flex-col h-full transition-all ${successId === job.id ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <span className="inline-block px-2.5 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full font-medium mb-2">{job.skill}</span>
                        <h3 className="font-semibold text-white leading-snug">{job.title}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-surface-400 line-clamp-2 mb-4 flex-1">{job.description || 'No description provided.'}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-surface-400">
                        <MapPin className="w-4 h-4 text-surface-500 flex-shrink-0" />
                        {job.location}
                      </div>
                      {(job.budget_min || job.budget_max) && (
                        <div className="flex items-center gap-2 text-sm text-surface-400">
                          <IndianRupee className="w-4 h-4 text-surface-500 flex-shrink-0" />
                          {job.budget_min && job.budget_max
                            ? `₹${job.budget_min} – ₹${job.budget_max}`
                            : job.budget_min ? `From ₹${job.budget_min}` : `Up to ₹${job.budget_max}`}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-surface-500">
                        <Clock className="w-3 h-3" />
                        {timeAgo(job.created_at)}
                        {(job as any).customer?.full_name && (
                          <span className="ml-auto">by {(job as any).customer.full_name}</span>
                        )}
                      </div>
                    </div>

                    {appStatus ? (
                      <div className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
                        appStatus === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                        appStatus === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-surface-700/50 text-surface-400'
                      }`}>
                        <CheckCircle className="w-4 h-4" />
                        {appStatus === 'accepted' ? 'Application Accepted!' :
                         appStatus === 'rejected' ? 'Not Selected' : 'Applied — Pending'}
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => { setApplyingJob(job); setCoverNote(''); }}
                        className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Send className="w-4 h-4" />
                        Apply Now
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Apply for Job</h3>
                <button onClick={() => setApplyingJob(null)} className="p-2 rounded-lg hover:bg-surface-800 transition-colors">
                  <X className="w-5 h-5 text-surface-400" />
                </button>
              </div>
              <div className="p-4 bg-surface-800/50 rounded-xl mb-4">
                <p className="font-medium text-white">{applyingJob.title}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-surface-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{applyingJob.location}</span>
                  {applyingJob.budget_max && <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />Up to ₹{applyingJob.budget_max}</span>}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-300 mb-2">Cover Note (optional)</label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  rows={4}
                  placeholder="Introduce yourself and explain why you're the right fit for this job..."
                  className="input-premium resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setApplyingJob(null)} className="flex-1 py-3 glass-button rounded-xl text-surface-300">Cancel</button>
                <motion.button
                  onClick={handleApply}
                  disabled={submitting}
                  className="flex-1 py-3 premium-button flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? 'Sending...' : (<><Send className="w-4 h-4" />Submit</>)}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
