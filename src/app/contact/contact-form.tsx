"use client";

import { useState } from "react";

export type ContactFormValues = {
  name: string;
  email: string;
  orderNumber?: string;
  topic: string;
  message: string;
};

const topics = [
  "Order question",
  "Damaged or incorrect item",
  "Customization / design help",
  "Bulk / corporate order",
  "General question",
  "Accessibility or safety",
];

export const ContactForm = () => {
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    orderNumber: "",
    topic: "Order question",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate request — integrate with API later when available
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-md border border-[#333] bg-[#1A1A1A] p-6">
        <h3 className="text-2xl font-semibold mb-2">Message sent</h3>
        <p className="text-[#B8B8B8]">
          Thank you for reaching out to Hotzy. We’ve received your message and will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Enter your full name"
          className="w-full rounded-md border border-[#333] bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#76B900]"
          value={values.name}
          onChange={onChange}
          type="text"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-md border border-[#333] bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#76B900]"
          value={values.email}
          onChange={onChange}
          type="email"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium text-white mb-2">
          Order Number (optional)
        </label>
        <input
          id="orderNumber"
          name="orderNumber"
          placeholder="#HZY-12345"
          className="w-full rounded-md border border-[#333] bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#76B900]"
          value={values.orderNumber}
          onChange={onChange}
          type="text"
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-white mb-2">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          required
          className="w-full rounded-md border border-[#333] bg-[#1A1A1A] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#76B900]"
          value={values.topic}
          onChange={onChange}
        >
          {topics.map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us how we can help…"
          className="w-full rounded-md border border-[#333] bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#76B900]"
          value={values.message}
          onChange={onChange}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-[#76B900] px-6 py-3 font-bold text-black transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};
