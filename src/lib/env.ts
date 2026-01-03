const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getSupabaseUrl = () => requireEnv('NEXT_PUBLIC_SUPABASE_URL');

export const getSupabaseAnonKey = () =>
  requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const getSupabaseServiceRoleKey = () =>
  requireEnv('SUPABASE_SERVICE_ROLE_KEY');
