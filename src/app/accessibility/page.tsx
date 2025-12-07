import type { Metadata } from "next";
import NavigationHeader from "@/components/sections/navigation-header";

export const metadata: Metadata = {
  title: "Accessibility | Hotzy",
  description:
    "Learn how Hotzy works to make our website and shopping experience accessible to everyone.",
};

export default function AccessibilityPage() {
  const features = [
    "Keyboard-friendly navigation for key flows such as browsing products, customizing mugs, and checking out.",
    "High-contrast text and clear visual hierarchy designed for readability on dark backgrounds.",
    "Alternative text for key images where they convey essential information.",
    "Labels and instructions for interactive elements such as forms, buttons, and sliders.",
    "Reduced reliance on color alone to communicate important information.",
    "Options to minimize motion or animation where possible, for users sensitive to movement.",
  ];

  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      <main className="text-white">
        <section className="container mx-auto max-w-[800px] py-20">
          <div className="mb-8">
            <p className="text-eyebrow text-[#B8B8B8]">Inclusive Experience</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Accessibility</h1>
            <p className="mt-3 text-body-large text-[#B8B8B8]">
              We want everyone to be able to discover, customize, and order Hotzy mugs with confidence.
            </p>
          </div>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-3">Our Commitment</h3>
            <p className="text-[#B8B8B8] leading-relaxed">
              Hotzy is committed to providing a digital experience that is accessible to the widest possible audience, regardless of technology or ability. We aim to follow recognized accessibility best practices and continuously improve our website.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-3">Key Accessibility Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-[#B8B8B8]">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-3">Assistive Technologies</h3>
            <p className="text-[#B8B8B8] leading-relaxed">
              Our goal is to support users who rely on screen readers, magnification tools, voice control, and other assistive technologies. While we are continually refining our implementation, we strive to provide clear headings, logical page structure, and accessible form fields.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-3">Known Limitations</h3>
            <p className="text-[#B8B8B8] leading-relaxed">
              Some experimental features, such as certain AR previews or complex 3D controls, may not yet be fully accessible. We are actively exploring alternative workflows and additional descriptions so more users can enjoy the customization experience.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-3">Feedback &amp; Support</h3>
            <p className="text-[#B8B8B8] leading-relaxed">
              If you encounter any accessibility barriers on Hotzy.ca, please let us know. We take such feedback seriously and use it to prioritize improvements.
            </p>
            <p className="text-[#B8B8B8] leading-relaxed">
              You can reach us via the Contact Us form, or by emailing us with the subject line "Accessibility Feedback".
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}