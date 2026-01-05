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

export const getStripeSecretKey = () => requireEnv('STRIPE_SECRET_KEY');

export const getStripeWebhookSecret = () =>
  requireEnv('STRIPE_WEBHOOK_SECRET');

export const getOrderUploadTokenSecret = () =>
  requireEnv('ORDER_UPLOAD_TOKEN_SECRET');

export const getSiteUrl = () =>
  requireEnv('NEXT_PUBLIC_SITE_URL');
