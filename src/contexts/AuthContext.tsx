import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, WorkerDetails } from '../types/database';

interface AuthContextType { user: User | null; profile: Profile | null; workerDetails: WorkerDetails | null; session: Session | null; loading: boolean; signIn: (email: string, password: string) => Promise<{ error: Error | null }>; signUp: (email: string, password: string, fullName: string, role: 'customer' | 'worker', phone?: string, location?: string) => Promise<{ error: Error | null }>; signOut: () => Promise<void>; refreshProfile: () => Promise<void>; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workerDetails, setWorkerDetails] = useState<WorkerDetails | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) { setSession(session); setUser(session?.user ?? null); if (session?.user) await fetchProfile(session.user.id); setLoading(false); }
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) { setSession(session); setUser(session?.user ?? null); if (session?.user) await fetchProfile(session.user.id); else { setProfile(null); setWorkerDetails(null); } setLoading(false); }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profileData) { setProfile(profileData); if (profileData.role === 'worker') { const { data: workerData } = await supabase.from('worker_details').select('*').eq('user_id', userId).single(); if (workerData) setWorkerDetails(workerData); } }
  };

  const signIn = async (email: string, password: string) => { const { error } = await supabase.auth.signInWithPassword({ email, password }); return { error: error as Error | null }; };
  const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'worker', phone?: string, location?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error as Error };
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({ id: data.user.id, email, full_name: fullName, role, phone, location });
      if (profileError) return { error: profileError as Error };
      if (role === 'worker') { const { error: workerError } = await supabase.from('worker_details').insert({ user_id: data.user.id, skills: [] }); if (workerError) return { error: workerError as Error }; }
    }
    return { error: null };
  };
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); setWorkerDetails(null); setSession(null); };
  const refreshProfile = async () => { if (user) await fetchProfile(user.id); };

  return <AuthContext.Provider value={{ user, profile, workerDetails, session, loading, signIn, signUp, signOut, refreshProfile }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (context === undefined) throw new Error('useAuth must be used within an AuthProvider'); return context; }
