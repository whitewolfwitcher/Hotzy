import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotzy - Design Your Perfect Mug",
};

export default function CustomizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
