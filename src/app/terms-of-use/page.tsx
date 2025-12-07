import type { Metadata } from "next";
import NavigationHeader from "@/components/sections/navigation-header";

export const metadata: Metadata = {
  title: "Terms of Use | Hotzy",
  description:
    "Read the terms and conditions for using the Hotzy website, customizing mugs, and completing your orders.",
};

export default function TermsOfUsePage() {
  const sections = [
    {
      heading: "1. Agreement to Terms",
      body:
        "By accessing or using Hotzy.ca (the \"Site\") and any related services, you agree to be bound by these Terms of Use. If you do not agree, you may not use the Site or place an order. These terms may be updated from time to time; the version date will be shown at the top of this page.",
    },
    {
      heading: "2. Eligibility & Account",
      body:
        "You must be of legal age to enter into a binding contract in your jurisdiction to place an order on Hotzy. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
    },
    {
      heading: "3. Ordering, Pricing & Payment",
      body:
        "When you submit an order, you are making an offer to purchase the selected products at the prices shown, including applicable taxes and shipping fees. Prices may change at any time prior to checkout. Orders are only accepted once payment has been successfully processed and you receive an order confirmation email.",
    },
    {
      heading: "4. Custom Artwork & User Content",
      body:
        "You are solely responsible for any images, text, or designs you upload to customize your mug. By uploading content, you confirm that you own or have permission to use it and that it does not infringe any copyright, trademark, or other rights, and is not hateful, illegal, or inappropriate. Hotzy reserves the right (but has no obligation) to refuse or cancel orders that contain content we consider inappropriate or unlawful.",
    },
    {
      heading: "5. Artwork Preview & AR Experience",
      body:
        "Our on-site preview tools and AR experiences are provided for visualization only. Colors, brightness, and positioning may vary slightly in the final printed product due to screen calibration, printing technology, and material characteristics. Such variations are considered normal and are not defects.",
    },
    {
      heading: "6. Shipping, Delivery & Risk of Loss",
      body:
        "Estimated delivery times are provided as a guideline and are not guaranteed. Once an order is handed over to the carrier, the risk of loss passes to you. Please ensure your shipping address is accurate before completing your order.",
    },
    {
      heading: "7. Returns, Replacements & Order Issues",
      body:
        "Because each Hotzy mug is custom-made, we generally cannot accept returns for change of mind. However, if your order arrives damaged, defective, or incorrect, please contact us within a reasonable time with photos and your order number so we can review the issue and, where appropriate, offer a replacement or store credit according to our policy.",
    },
    {
      heading: "8. Intellectual Property",
      body:
        "All non-user content on the Site — including the Hotzy name, logo, product photos, designs, interface elements, and AR experiences — is owned by Hotzy or its licensors and is protected by intellectual property laws. You may not copy, distribute, or create derivative works from this content without prior written permission.",
    },
    {
      heading: "9. Prohibited Uses",
      body:
        "You agree not to misuse the Site, including but not limited to: attempting to hack or disrupt the service, scraping or harvesting data, using the Site for fraudulent orders, or uploading unlawful or harmful content.",
    },
    {
      heading: "10. Limitation of Liability",
      body:
        "To the maximum extent permitted by law, Hotzy is not liable for any indirect, incidental, or consequential damages arising out of your use of the Site or products, even if we have been advised of the possibility of such damages. Our total liability for any claim related to your purchase will not exceed the amount you paid for the specific order in question.",
    },
    {
      heading: "11. Governing Law",
      body:
        "These Terms of Use are intended to be governed by the laws of your local jurisdiction where Hotzy is registered and operating. Please customize this section with the specific province / state and country based on legal advice.",
    },
    {
      heading: "12. Contact",
      body:
        "If you have questions about these Terms of Use, you can reach us through the Contact Us page or by email using the contact information listed there.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      <main className="text-white">
        <section className="container mx-auto max-w-[800px] py-20">
          <div className="mb-8">
            <p className="text-eyebrow text-[#B8B8B8]">Legal Information</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Terms of Use</h1>
            <p className="mt-3 text-body-large text-[#B8B8B8]">
              Please read this carefully before using Hotzy.ca or placing an order.
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