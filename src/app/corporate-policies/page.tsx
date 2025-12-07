import type { Metadata } from "next";
import NavigationHeader from "@/components/sections/navigation-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Corporate Policies | Hotzy",
  description:
    "Read about Hotzy's values, sourcing principles, privacy approach, and customer policies.",
};

export default function CorporatePoliciesPage() {
  const sections = [
    {
      heading: "Our Values",
      body:
        "Hotzy was created around a simple idea: everyday objects can feel magical. We combine playful thermochromic technology, custom designs, and thoughtful packaging to create mugs that feel personal and memorable. We value creativity, transparency, and respect for our customers, partners, and team.",
    },
    {
      heading: "Quality & Sourcing",
      body:
        "We work with carefully selected suppliers for our ceramic mugs, coatings, and printing materials. Our goal is to balance durability, safety, and visual quality. We continuously review supplier certifications and test batches to maintain consistent results. Exact supplier details and certifications can be added here once finalized.",
    },
    {
      heading: "Environmental Approach",
      body:
        "We aim to reduce waste by producing mugs on demand, which keeps unused inventory low. We are exploring more eco-conscious packaging, inks, and logistics partners. As our operations grow, this section can be expanded with specific commitments and certifications.",
    },
    {
      heading: "Customer Care & Complaints",
      body:
        "We want every Hotzy mug to arrive as expected. If something goes wrong, we encourage customers to contact us with photos and a description of the issue. We review each case individually and aim to respond within a reasonable time frame with a clear resolution path (such as a replacement or store credit, where appropriate).",
    },
    {
      heading: "Privacy & Data",
      body:
        "We collect only the information necessary to process orders, provide customer support, and improve our services. This typically includes contact details, shipping information, and order history. Payment information is handled securely by our payment provider and is not stored directly by Hotzy. A full privacy policy can be linked from this section once finalized.",
    },
    {
      heading: "Ethical Standards",
      body:
        "Hotzy does not tolerate hateful, violent, or discriminatory content on our products. We reserve the right to decline designs that conflict with our values or applicable law.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      <main className="text-white">
        <section className="container mx-auto max-w-[900px] py-20">
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-[#76B900] px-4 py-2 font-semibold text-black transition-colors hover:bg-[#9ACD32]"
              >
                Home
              </Link>
            </div>
            <p className="text-eyebrow text-[#B8B8B8]">How Hotzy Works</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Corporate Policies</h1>
            <p className="mt-3 text-body-large text-[#B8B8B8]">
              A quick overview of how we operate as a brand and how we care for our customers.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h3 className="text-2xl font-semibold mb-3">{s.heading}</h3>
                <p className="text-[#B8B8B8] leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}