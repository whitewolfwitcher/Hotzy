import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import NavigationHeader from "@/components/sections/navigation-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Hotzy",
  description:
    "Get in touch with Hotzy for order questions, custom projects, or general inquiries.",
};

export default function ContactPage() {
  const leftBlocks = [
    {
      heading: "We'd love to hear from you",
      body:
        "Whether you're tracking an order, planning gifts for a team, or exploring custom artwork, you can reach us using the form on this page. We aim to reply within a reasonable timeframe on business days.",
    },
    {
      heading: "Helpful details to include",
      list: [
        "Your order number (if you already placed an order).",
        "Photos, if you're reporting a damaged or incorrect item.",
        "The quantity and timeline, if you're asking about a custom or bulk project.",
        "Any reference images or links, if you have a specific design idea.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      <main className="text-white">
        <section className="container mx-auto max-w-[1000px] py-20">
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-[#76B900] px-4 py-2 font-semibold text-black transition-colors hover:bg-[#9ACD32]"
              >
                Home
              </Link>
            </div>
            <p className="text-eyebrow text-[#B8B8B8]">Support</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Contact Us</h1>
            <p className="mt-3 text-body-large text-[#B8B8B8]">
              Questions about your order, custom designs, or wholesale? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="space-y-8">
              {leftBlocks.map((b) => (
                <section key={b.heading}>
                  <h3 className="text-2xl font-semibold mb-3">{b.heading}</h3>
                  {b.body ? (
                    <p className="text-[#B8B8B8] leading-relaxed">{b.body}</p>
                  ) : null}
                  {Array.isArray(b.list) ? (
                    <ul className="list-disc pl-6 space-y-2 text-[#B8B8B8]">
                      {b.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}