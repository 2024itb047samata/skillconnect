import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Job, JobApplication } from '../../types/database';
import { Briefcase, MapPin, IndianRupee, Clock, Users, Star, CheckCircle, XCircle, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationsMap, setApplicationsMap] = useState<Record<string, JobApplication[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => { if (user) fetchJobs(); }, [user]);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('customer_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) {
      setJobs(data as Job[]);
      await fetchApplications(data.map((j: Job) => j.id));
    }
    setLoading(false);
  };

  const fetchApplications = async (jobIds: string[]) => {
    if (!jobIds.length) return;
    const { data } = await supabase
      .from('job_applications')
      .select('*, worker:profiles!job_applications_worker_id_fkey(*), worker_details:worker_details!job_applications_worker_id_fkey(rating, completed_jobs, experience_years, hourly_rate, skills)')
      .in('job_id', jobIds);
    if (data) {
      const map: Record<string, JobApplication[]> = {};
      data.forEach((app: JobApplication) => {
        if (!map[app.job_id]) map[app.job_id] = [];
        map[app.job_id].push(app);
      });
      setApplicationsMap(map);
    }
  };

  const handleDecision = async (app: JobApplication, decision: 'accepted' | 'rejected') => {
    setProcessingId(app.id);
    await supabase.from('job_applications').update({ status: decision }).eq('id', app.id);

    if (decision === 'accepted') {
      await Promise.all([
        supabase.from('bookings').insert({
          job_id: app.job_id,
          customer_id: user!.id,
          worker_id: app.worker_id,
          status: 'accepted',
          notes: `Hired via job application`,
        }),
        supabase.from('jobs').update({ status: 'in_progress' }).eq('id', app.job_id),
        supabase.from('job_applications')
          .update({ status: 'rejected' })
          .eq('job_id', app.job_id)
          .neq('id', app.id),
      ]);
      setJobs((prev) => prev.map((j) => j.id === app.job_id ? { ...j, status: 'in_progress' } : j));
    }

    setApplicationsMap((prev) => {
      const jobApps = (prev[app.job_id] || []).map((a) => {
        if (a.id === app.id) return { ...a, status: decision };
        if (decision === 'accepted') return { ...a, status: 'rejected' as const };
        return a;
      });
      return { ...prev, [app.job_id]: jobApps };
    });
    setProcessingId(null);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      open: 'bg-emerald-500/20 text-emerald-400',
      in_progress: 'bg-amber-500/20 text-amber-400',
      completed: 'bg-primary-500/20 text-primary-400',
      cancelled: 'bg-surface-700 text-surface-400',
    };
    return map[status] || 'bg-surface-700 text-surface-400';
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d} days ago`;
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-primary-400" />
              <span className="text-sm text-surface-400">Job Management</span>
            </div>
            <h1 className="text-3xl font-bold">My <span className="text-gradient">Posted Jobs</span></h1>
          </div>
          <Link to="/customer/post-job" className="premium-button px-5 py-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Post Job
          </Link>
        </motion.div>

        {jobs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center">
            <Briefcase className="w-16 h-16 text-surface-600 mx-auto mb-4" />
            <p className="text-surface-400 text-lg">No jobs posted yet</p>
            <Link to="/customer/post-job" className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl">
              Post Your First Job
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const apps = applicationsMap[job.id] || [];
              const pendingApps = apps.filter((a) => a.status === 'pending');
              const isExpanded = expandedJob === job.id;

              return (
                <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
                  {/* Job Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block px-2.5 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full font-medium">{job.skill}</span>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(job.status)}`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white text-lg">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-surface-400">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                          {job.budget_max && (<span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" />Up to ₹{job.budget_max}</span>)}
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{timeAgo(job.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 text-surface-300">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold">{apps.length}</span>
                          </div>
                          <p className="text-xs text-surface-500 mt-0.5">{pendingApps.length} pending</p>
                        </div>
                        {isExpanded
                          ? <ChevronDown className="w-5 h-5 text-surface-400" />
                          : <ChevronRight className="w-5 h-5 text-surface-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Applicants Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/10"
                      >
                        <div className="p-6">
                          {apps.length === 0 ? (
                            <div className="text-center py-8">
                              <Users className="w-12 h-12 text-surface-600 mx-auto mb-3" />
                              <p className="text-surface-400">No applicants yet</p>
                              <p className="text-xs text-surface-600 mt-1">Workers will appear here once they apply</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-surface-300 mb-4">
                                {apps.length} Applicant{apps.length !== 1 ? 's' : ''}
                              </h4>
                              {apps.map((app) => {
                                const wd = (app as any).worker_details;
                                return (
                                  <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 ${
                                      app.status === 'accepted' ? 'bg-emerald-500/10 border border-emerald-500/30' :
                                      app.status === 'rejected' ? 'bg-surface-800/30 opacity-60' : 'bg-surface-800/50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">{(app as any).worker?.full_name?.charAt(0)}</span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate">{(app as any).worker?.full_name}</p>
                                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-surface-400">
                                          {wd?.rating > 0 && (
                                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{Number(wd.rating).toFixed(1)}</span>
                                          )}
                                          {wd?.experience_years > 0 && (
                                            <span>{wd.experience_years}y exp</span>
                                          )}
                                          {wd?.hourly_rate && (
                                            <span>₹{wd.hourly_rate}/hr</span>
                                          )}
                                          {wd?.completed_jobs > 0 && (
                                            <span>{wd.completed_jobs} jobs done</span>
                                          )}
                                        </div>
                                        {app.cover_note && (
                                          <p className="text-xs text-surface-500 italic mt-1.5 line-clamp-2">"{app.cover_note}"</p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {app.status === 'pending' && job.status === 'open' ? (
                                        <>
                                          <motion.button
                                            onClick={() => handleDecision(app, 'rejected')}
                                            disabled={processingId === app.id}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                          >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                          </motion.button>
                                          <motion.button
                                            onClick={() => handleDecision(app, 'accepted')}
                                            disabled={processingId === app.id}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-gradient-to-r from-primary-600 to-accent-500 text-white font-medium disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                            Accept
                                          </motion.button>
                                        </>
                                      ) : (
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                          app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-700 text-surface-400'
                                        }`}>
                                          {app.status === 'accepted' ? '✓ Hired' : 'Not selected'}
                                        </span>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
