import { cookies, headers } from "next/headers";
import { sendGa4MpEvent } from "@/lib/analytics/ga4Mp";

type EventPayload = {
  name: string;
  params?: Record<string, unknown>;
  url: string;
  title?: string;
  path?: string;
  clientId: string;
};

const getRequestIp = () => {
  const forwarded = headers().get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return headers().get("x-real-ip");
};

export async function POST(request: Request) {
  const consent = cookies().get("hotzy_consent")?.value;
  if (consent !== "granted") {
    return new Response(null, { status: 204 });
  }

  const body = (await request.json().catch(() => null)) as EventPayload | null;
  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.url !== "string" ||
    typeof body.clientId !== "string"
  ) {
    return new Response(null, { status: 400 });
  }

  const userAgent = headers().get("user-agent");
  const ip = getRequestIp();

  const extraParams =
    body.params && typeof body.params === "object" && !Array.isArray(body.params)
      ? body.params
      : {};

  const payload = {
    client_id: body.clientId,
    events: [
      {
        name: body.name,
        params: {
          ...extraParams,
          page_location: body.url,
          page_title: body.title ?? "",
          page_path: body.path ?? "",
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
