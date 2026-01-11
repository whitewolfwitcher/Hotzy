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

type Ga4MpPayload = {
  client_id: string;
  events: Ga4Event[];
  user_properties?: Ga4UserProperties;
  user_agent?: string;
  ip_override?: string;
};

type SendGa4MpOptions = {
  debug?: boolean;
};

const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID ?? "";
// Create this in GA4 Admin -> Data Streams -> Measurement Protocol API secrets.
const GA4_API_SECRET = process.env.GA4_API_SECRET ?? "";
const GA4_DEBUG = process.env.GA4_DEBUG ?? "";

const hasValue = (value?: string | null) =>
  typeof value === "string" && value.trim().length > 0;

const getCollectUrl = (debug = false) => {
  const measurementId = encodeURIComponent(GA4_MEASUREMENT_ID);
  const apiSecret = encodeURIComponent(GA4_API_SECRET);
  const base = debug
    ? "https://www.google-analytics.com/debug/mp/collect"
    : "https://www.google-analytics.com/mp/collect";
  return `${base}?measurement_id=${measurementId}&api_secret=${apiSecret}`;
};

const logMissingEnv = () => {
  console.error("[ga4mp] missing env");
};

const logSendError = (error: unknown) => {
  console.error("[ga4mp] send error", error);
};

const logCollectStatus = (status?: number) => {
  if (typeof status === "number") {
    console.log("[ga4mp] collect status", status);
  } else {
    console.log("[ga4mp] collect status unknown");
  }
};

const logValidationMessages = (messages: unknown) => {
  console.log("[ga4mp] validationMessages", messages);
};

export const sendCollect = async (payload: Ga4MpPayload) => {
  try {
    return await fetch(getCollectUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    logSendError(error);
    return null;
  }
};

export const sendDebug = async (payload: Ga4MpPayload) => {
  try {
    const response = await fetch(getCollectUrl(true), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json().catch(() => null);
  } catch (error) {
    logSendError(error);
    return null;
  }
};

export async function sendGa4MpEvent(
  payload: Ga4MpPayload,
  options: SendGa4MpOptions = {}
): Promise<void> {
  try {
    if (!hasValue(GA4_MEASUREMENT_ID) || !hasValue(GA4_API_SECRET)) {
      logMissingEnv();
      return;
    }

    if (!payload?.client_id || !Array.isArray(payload.events) || payload.events.length === 0) {
      return;
    }

    const debugEnabled =
      GA4_DEBUG.trim().toLowerCase() === "true" || options.debug === true;
    if (debugEnabled) {
      const debugBody = await sendDebug(payload);
      logValidationMessages(debugBody?.validationMessages ?? debugBody);
    }

    const response = await sendCollect(payload);
    logCollectStatus(response?.status);
  } catch (error) {
    logSendError(error);
  }
}

export async function sendGa4Event(input: SendGa4EventInput): Promise<void> {
  const payload: Ga4MpPayload = {
    client_id: input.clientId,
    events: input.events,
  };

  if (input.userProperties && Object.keys(input.userProperties).length > 0) {
    payload.user_properties = input.userProperties;
  }

  if (hasValue(input.userAgent)) {
    payload.user_agent = input.userAgent ?? undefined;
  }

  if (hasValue(input.ip)) {
    payload.ip_override = input.ip ?? undefined;
  }

  await sendGa4MpEvent(payload);
}
