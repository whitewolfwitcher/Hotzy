import { cookies, headers } from "next/headers";
import { sendGa4MpEvent } from "@/lib/analytics/ga4Mp";

type PageViewPayload = {
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

  const body = (await request.json().catch(() => null)) as PageViewPayload | null;
  if (!body || typeof body.url !== "string" || typeof body.clientId !== "string") {
    return new Response(null, { status: 400 });
  }

  const userAgent = headers().get("user-agent");
  const ip = getRequestIp();

  await sendGa4MpEvent({
    clientId: body.clientId,
    userAgent,
    ip,
    events: [
      {
        name: "page_view",
        params: {
          page_location: body.url,
          page_title: body.title ?? "",
          page_path: body.path ?? "",
        },
      },
    ],
  });

  return new Response(null, { status: 204 });
}
