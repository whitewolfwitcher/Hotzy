"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  readConsent,
  subscribeConsentChange,
  type ConsentState,
} from "@/lib/analytics/consent";
import { getOrCreateClientId } from "@/lib/analytics/clientId";
import { captureAttribution, getAttribution } from "@/lib/analytics/attribution";

export default function GaProvider(): null {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState>("unknown");
  const hasLoggedErrorRef = useRef(false);
  const hasCapturedAttributionRef = useRef(false);

  useEffect(() => {
    setConsent(readConsent());
    return subscribeConsentChange(setConsent);
  }, []);

  useEffect(() => {
    if (consent !== "granted") {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    if (!hasCapturedAttributionRef.current) {
      captureAttribution();
      hasCapturedAttributionRef.current = true;
    }

    const clientId = getOrCreateClientId();
    if (!clientId) return;

    const attribution = getAttribution();
    const referrer = document.referrer || attribution?.referrer || undefined;
    const payload = {
      url: window.location.href,
      title: document.title,
      path: `${window.location.pathname}${window.location.search}`,
      attribution: attribution ?? undefined,
      referrer,
      clientId,
    };

    fetch("/api/analytics/ga4/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((error) => {
      if (hasLoggedErrorRef.current) return;
      hasLoggedErrorRef.current = true;
      console.error("[ga4-mp] page_view failed", error);
    });
  }, [consent, pathname]);

  return null;
}
