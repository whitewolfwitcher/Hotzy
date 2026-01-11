import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { Toaster } from "@/components/ui/sonner";
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
        <Suspense fallback={null}>
          <GaProvider />
        </Suspense>
        <ConsentBanner />
        <PreferencesProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </PreferencesProvider>
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
