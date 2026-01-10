import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import CustomAutumnProvider from "@/lib/autumn-provider";
import { CartProvider } from "@/contexts/cart-context";
import { PreferencesProvider } from "@/contexts/preferences-context";
import GaProvider from "@/components/analytics/GaProvider";
import ConsentBanner from "@/components/analytics/ConsentBanner";

export const metadata: Metadata = {
  title: "Hotzy - AR Custom Mug Website",
  description: "Customize your mug. See it in AR. Premium thermochromic mugs with real-time AR preview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <GaProvider />
        <ConsentBanner />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <PreferencesProvider>
          <CartProvider>
            <CustomAutumnProvider>
              {children}
            </CustomAutumnProvider>
          </CartProvider>
        </PreferencesProvider>
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
