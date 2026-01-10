"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGa, isGaEnabled, pageView } from "@/lib/analytics/ga";
import {
  readConsent,
  subscribeConsentChange,
  type ConsentState,
} from "@/lib/analytics/consent";

const buildPagePath = (
  pathname: string,
  searchParams: URLSearchParams | null,
): string => {
  const search = searchParams?.toString();
  if (!search) {
    return pathname;
  }

  return `${pathname}?${search}`;
};

export default function GaProvider(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState<ConsentState>("unknown");

  useEffect(() => {
    setConsent(readConsent());
    return subscribeConsentChange(setConsent);
  }, []);

  const pagePath = useMemo(
    () => buildPagePath(pathname ?? "/", searchParams),
    [pathname, searchParams],
  );

  useEffect(() => {
    if (consent !== "granted" || !isGaEnabled()) {
      return;
    }

    initGa();
    pageView({
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    });
  }, [consent, pagePath]);

  return null;
}
