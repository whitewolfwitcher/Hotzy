"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ensureGaBaseLoaded,
  getGaMeasurementId,
  grantGaAnalytics,
  trackGaPageView,
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

  useEffect(() => {
    if (consent !== "granted" || !measurementId) {
      return;
    }

    ensureGaBaseLoaded(measurementId);
    grantGaAnalytics(measurementId);
  }, [consent, measurementId]);

  useEffect(() => {
    if (consent !== "granted" || !measurementId) {
      return;
    }

    trackGaPageView(measurementId, window.location.href);
  }, [consent, measurementId, pathname]);

  return null;
}
