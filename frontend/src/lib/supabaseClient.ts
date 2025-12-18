// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Must exist in your vite env (.env or .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase URL or Anon Key in environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
