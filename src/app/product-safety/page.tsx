import type { Metadata } from "next";
import NavigationHeader from "@/components/sections/navigation-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Safety | Hotzy",
  description:
    "Learn how to use, care for, and safely enjoy your Hotzy thermo-color mugs.",
};

export default function ProductSafetyPage() {
  const sections = [
    {
      heading: "Intended Use",
      body:
        "Hotzy mugs are designed for hot beverages such as coffee, tea, or hot chocolate. They are for everyday home and office use. They are not toys and should be kept out of reach of very young children.",
    },
    {
      heading: "Thermo-Color Coating",
      body:
        "The color-change effect is created by a special heat-sensitive coating applied to the mug. This coating is designed for normal use with hot liquids. Avoid scratching the surface with sharp or abrasive objects to preserve the finish and artwork.",
    },
    {
      heading: "Dishwasher & Microwave",
      body:
        "To maximize the lifespan of the print and coating, we recommend gentle hand-washing with a soft sponge and mild detergent. High-heat dishwashers and microwaves may reduce the intensity or longevity of the color-change effect over time. Please confirm final care instructions with your supplier's safety guidelines and update this section accordingly.",
    },
    {
      heading: "Heat & Handling",
      body:
        "Like any ceramic mug, Hotzy mugs can become hot when filled with boiling liquids. Always use the handle and exercise caution when serving children or individuals with reduced heat sensitivity.",
    },
    {
      heading: "Damage & Cracks",
      body:
        "Do not use the mug if it is chipped, cracked, or significantly damaged. Broken ceramic can be sharp and may cause injury. Dispose of damaged mugs safely.",
    },
    {
      heading: "Allergy & Compliance Information",
      body:
        "If you require information about materials, coatings, or compliance with specific standards (for example, food-contact or regional regulations), please contact us. We can share the latest documentation available from our manufacturing partners.",
    },
    {
      heading: "Questions About Safety",
      body:
        "If you have any questions about the safe use or care of your Hotzy mug, please reach out through the Contact Us page with the subject line \"Product Safety\".",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      <main className="text-white">
        <section className="container mx-auto max-w-[800px] py-20">
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-[#76B900] px-4 py-2 font-semibold text-black transition-colors hover:bg-[#9ACD32]"
              >
                Home
              </Link>
            </div>
            <p className="text-eyebrow text-[#B8B8B8]">Safety First</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Product Safety &amp; Care</h1>
            <p className="mt-3 text-body-large text-[#B8B8B8]">
              Important information about using your Hotzy mug safely and keeping the color-change effect at its best.
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