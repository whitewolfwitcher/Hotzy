const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getStripeSecretKey = () => requireEnv('STRIPE_SECRET_KEY');

export const getStripeWebhookSecret = () =>
  requireEnv('STRIPE_WEBHOOK_SECRET');

export const assertStripeLiveModeEnv = () => {
  if (process.env.NODE_ENV !== 'production') return;

  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!process.env.STRIPE_WEBHOOK_SECRET) missing.push('STRIPE_WEBHOOK_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `Missing required Stripe env vars for production: ${missing.join(', ')}`
    );
  }
};

export const getSiteUrl = () =>
  requireEnv('NEXT_PUBLIC_SITE_URL');
