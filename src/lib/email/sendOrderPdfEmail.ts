"use server";

import { Resend } from "resend";

type SendOrderPdfEmailInput = {
  orderId: string;
  cupType: string;
  currency: string;
  amount: number | null;
  signedPdfUrl: string;
};

const buildAmountLine = (amount: number | null, currency: string) => {
  if (amount == null) {
    return `Unknown (${currency})`;
  }
  return `${amount} ${currency}`;
};

export const sendOrderPdfEmail = async ({
  orderId,
  cupType,
  currency,
  amount,
  signedPdfUrl,
}: SendOrderPdfEmailInput) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;

  if (!apiKey || !from || !to) {
    console.error("sendOrderPdfEmail error", "Missing email configuration");
    return { ok: false, error: "Missing email configuration" };
  }

  const resend = new Resend(apiKey);
  const subject = `Hotzy Order Ready: ${orderId}`;
  const amountLine = buildAmountLine(amount, currency);

  const html = `
    <div>
      <h2>Hotzy order ready</h2>
      <p>Order ID: <strong>${orderId}</strong></p>
      <p>Cup type: <strong>${cupType}</strong></p>
      <p>Amount: <strong>${amountLine}</strong></p>
      <p>Download PDF: <a href="${signedPdfUrl}">Download</a></p>
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
        typeof error === "string"
          ? error
          : error?.message ?? "Resend error";
      console.error("sendOrderPdfEmail error", message);
      return { ok: false, error: "Failed to send email" };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("sendOrderPdfEmail error", message);
    return { ok: false, error: "Failed to send email" };
  }

  return { ok: true };
};
