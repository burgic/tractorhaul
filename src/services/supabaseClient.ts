import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_DATABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey,
{
    auth: {
      persistSession: true, // Enable session persistence
      autoRefreshToken: false, // Disable auto-refreshing the token
      storageKey: 'app-auth',
      detectSessionInUrl: true,
      storage: localStorage // Use localStorage for session storage
    },
    db: {
        schema: 'public'
    }
  }
)
