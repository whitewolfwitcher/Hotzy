"use client";

import { useEffect, useState } from "react";
import {
  readConsent,
  subscribeConsentChange,
  writeConsent,
  type ConsentState,
} from "@/lib/analytics/consent";
import {
  ensureGaBaseLoaded,
  getGaMeasurementId,
  grantGaAnalytics,
} from "@/lib/analytics/ga";

export default function ConsentBanner() {
  const [consent, setConsent] = useState<ConsentState>("unknown");
  const measurementId = getGaMeasurementId();

  useEffect(() => {
    setConsent(readConsent());
    return subscribeConsentChange(setConsent);
  }, []);

  if (consent !== "unknown") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 p-4 text-neutral-900 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p className="font-medium">Analytics consent</p>
          <p className="text-neutral-600">
            We use analytics to understand product usage. You can accept or
            reject.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              writeConsent("denied");
              setConsent("denied");
            }}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => {
              writeConsent("granted");
              setConsent("granted");
              if (measurementId) {
                ensureGaBaseLoaded(measurementId);
                grantGaAnalytics(measurementId);
              }
            }}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
