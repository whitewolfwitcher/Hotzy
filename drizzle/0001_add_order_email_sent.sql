ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;
