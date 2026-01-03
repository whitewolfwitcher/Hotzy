import { createClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/env';

export const supabaseBrowser = () =>
  createClient(getSupabaseUrl(), getSupabaseAnonKey());
