"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const getTitleForHash = (hash: string) => {
  if (hash === "#design-gallery") return "Hotzy - Design Gallery";
  if (hash === "#gallery") return "Hotzy - Gallery";
  return "Hotzy";
};

export default function HashTitleSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const updateTitle = () => {
      if (typeof document === "undefined") return;
      document.title = getTitleForHash(window.location.hash);
    };

    updateTitle();
    window.addEventListener("hashchange", updateTitle);

    return () => {
      window.removeEventListener("hashchange", updateTitle);
    };
  }, [pathname]);

  return null;
}
