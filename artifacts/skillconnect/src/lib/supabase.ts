import { createClient } from '@supabase/supabase-js';

console.log('URL=', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY=', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20));

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);