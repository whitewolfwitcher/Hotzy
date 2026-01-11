"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ensureGaBase,
  getGaMeasurementId,
  grantGaAnalytics,
  isGaEnabled,
  pageView,
} from "@/lib/analytics/ga";
import {
  readConsent,
  subscribeConsentChange,
  type ConsentState,
} from "@/lib/analytics/consent";

export default function GaProvider(): null {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState>("unknown");
  const measurementId = getGaMeasurementId();

  useEffect(() => {
    setConsent(readConsent());
    return subscribeConsentChange(setConsent);
  }, []);

  const pagePath = useMemo(() => pathname ?? "/", [pathname]);

  useEffect(() => {
    if (consent !== "granted" || !isGaEnabled(measurementId)) {
      return;
    }

    ensureGaBase(measurementId);
    grantGaAnalytics(measurementId);
  }, [consent, measurementId]);

  useEffect(() => {
    if (consent !== "granted" || !isGaEnabled(measurementId)) {
      return;
    }

    pageView({
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    }, measurementId);
  }, [consent, measurementId, pagePath]);

  return null;
}
