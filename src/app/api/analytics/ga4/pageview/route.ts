import { cookies, headers } from "next/headers";
import { sendGa4MpEvent } from "@/lib/analytics/ga4Mp";

type PageViewPayload = {
  url: string;
  title?: string;
  path?: string;
  attribution?: Record<string, string>;
  referrer?: string;
  clientId: string;
};

const getRequestIp = () => {
  const forwarded = headers().get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return headers().get("x-real-ip");
};

export async function POST(request: Request) {
  const consent = cookies().get("hotzy_consent")?.value ?? "unknown";
  const body = (await request.json().catch(() => null)) as PageViewPayload | null;
  let derivedPath = "";
  if (typeof body?.path === "string" && body.path.length > 0) {
    derivedPath = body.path;
  } else if (typeof body?.url === "string") {
    try {
      derivedPath = new URL(body.url).pathname;
    } catch {
      derivedPath = "";
    }
  }

  console.log("[ga4] pageview endpoint hit", {
    consent,
    path: derivedPath,
  });

  if (consent !== "granted") {
    return new Response(null, { status: 204 });
  }

  if (!body || typeof body.url !== "string" || typeof body.clientId !== "string") {
    return new Response(null, { status: 400 });
  }

  const userAgent = headers().get("user-agent");
  const ip = getRequestIp();

  const attribution =
    body.attribution && typeof body.attribution === "object"
      ? body.attribution
      : {};
  const payload = {
    client_id: body.clientId,
    events: [
      {
        name: "page_view",
        params: {
          page_location: body.url,
          page_title: body.title ?? "",
          page_path: body.path ?? "",
          page_referrer:
            typeof body.referrer === "string" ? body.referrer : undefined,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
          utm_content: attribution.utm_content,
          utm_term: attribution.utm_term,
          gclid: attribution.gclid,
          fbclid: attribution.fbclid,
        },
      },
    ],
  };

  await sendGa4MpEvent(
    {
      ...payload,
      user_agent: userAgent ?? undefined,
      ip_override: ip ?? undefined,
    },
    { debug: process.env.GA4_DEBUG === "true" }
  );

  return new Response(null, { status: 204 });
}
