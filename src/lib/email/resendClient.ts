import { Resend } from 'resend';

type SendOrderReadyEmailInput = {
  orderId: string;
  cupType: string;
  currency: string;
  amount: number | null;
  pdfUrl: string;
};

const DEFAULT_FROM = 'Hotzy <orders@hotzy.ca>';

const buildAmountLine = (amount: number | null, currency: string) => {
  if (amount == null) {
    return `Unknown (${currency})`;
  }
  return `${amount} ${currency}`;
};

export const sendOrderReadyEmail = async ({
  orderId,
  cupType,
  currency,
  amount,
  pdfUrl,
}: SendOrderReadyEmailInput) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM || DEFAULT_FROM;

  if (!apiKey || !to) {
    console.error('sendOrderReadyEmail error', 'Missing email configuration');
    return { ok: false, error: 'Missing email configuration' };
  }

  const resend = new Resend(apiKey);
  const subject = `Hotzy Order Ready: ${orderId}`;
  const amountLine = buildAmountLine(amount, currency);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hotzy order ready</h2>
      <p>Order ID: <strong>${orderId}</strong></p>
      <p>Cup type: <strong>${cupType}</strong></p>
      <p>Amount: <strong>${amountLine}</strong></p>
      <p>
        <a
          href="${pdfUrl}"
          style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;"
        >
          Download PDF
        </a>
      </p>
      <p>If the button doesn't work, use this link: <a href="${pdfUrl}">${pdfUrl}</a></p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.message ?? 'Resend error';
      console.error('sendOrderReadyEmail error', message);
      return { ok: false, error: 'Failed to send email' };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('sendOrderReadyEmail error', message);
    return { ok: false, error: 'Failed to send email' };
  }

  return { ok: true };
};
