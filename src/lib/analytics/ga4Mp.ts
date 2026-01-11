type Ga4Event = {
  name: string;
  params?: Record<string, unknown>;
};

type Ga4UserProperties = Record<string, { value: string | number | boolean }>;

type SendGa4EventInput = {
  clientId: string;
  userAgent?: string | null;
  ip?: string | null;
  events: Ga4Event[];
  userProperties?: Ga4UserProperties;
};

type SendGa4MpEventInput = {
  clientId: string;
  userAgent?: string | null;
  ip?: string | null;
  events: Ga4Event[];
};

const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID ?? "";
// Create this in GA4 Admin -> Data Streams -> Measurement Protocol API secrets.
const GA4_API_SECRET = process.env.GA4_API_SECRET ?? "";
const GA4_DEBUG = process.env.GA4_DEBUG ?? "";

let loggedConfigError = false;
let loggedSendError = false;

const hasValue = (value?: string | null) =>
  typeof value === "string" && value.trim().length > 0;

const isDebugEnabled = () =>
  ["1", "true", "yes", "on"].includes(GA4_DEBUG.trim().toLowerCase());

const getCollectUrl = (debug = false) => {
  const measurementId = encodeURIComponent(GA4_MEASUREMENT_ID);
  const apiSecret = encodeURIComponent(GA4_API_SECRET);
  const base = debug
    ? "https://www.google-analytics.com/debug/mp/collect"
    : "https://www.google-analytics.com/mp/collect";
  return `${base}?measurement_id=${measurementId}&api_secret=${apiSecret}`;
};

const logConfigErrorOnce = () => {
  if (loggedConfigError) return;
  loggedConfigError = true;
  console.error("[ga4-mp] Missing GA4_MEASUREMENT_ID or GA4_API_SECRET");
};

const logSendErrorOnce = (error: unknown) => {
  if (loggedSendError) return;
  loggedSendError = true;
  console.error("[ga4-mp] Failed to send Measurement Protocol event", error);
};

const sendPayload = async ({
  clientId,
  userAgent,
  ip,
  events,
  userProperties,
}: SendGa4EventInput): Promise<void> => {
  try {
    if (!hasValue(GA4_MEASUREMENT_ID) || !hasValue(GA4_API_SECRET)) {
      logConfigErrorOnce();
      return;
    }

    if (!hasValue(clientId) || !Array.isArray(events) || events.length === 0) {
      return;
    }

    const payload: Record<string, unknown> = {
      client_id: clientId,
      events,
    };

    if (userProperties && Object.keys(userProperties).length > 0) {
      payload.user_properties = userProperties;
    }

    if (hasValue(userAgent)) {
      payload.user_agent = userAgent;
    }

    if (hasValue(ip)) {
      payload.ip_override = ip;
    }

    await fetch(getCollectUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (isDebugEnabled()) {
      const debugResponse = await fetch(getCollectUrl(true), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const debugBody = await debugResponse.json().catch(() => null);
      const validationMessages = debugBody?.validationMessages;
      if (Array.isArray(validationMessages) && validationMessages.length > 0) {
        console.log("[ga4-mp] validationMessages", validationMessages);
      }
    }
  } catch (error) {
    logSendErrorOnce(error);
  }
};

export async function sendGa4MpEvent({
  clientId,
  userAgent,
  ip,
  events,
}: SendGa4MpEventInput): Promise<void> {
  await sendPayload({ clientId, userAgent, ip, events });
}

export async function sendGa4Event(input: SendGa4EventInput): Promise<void> {
  await sendPayload(input);
}
