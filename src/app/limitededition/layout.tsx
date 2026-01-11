import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotzy - Limited Edition",
};

export default function LimitedEditionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
