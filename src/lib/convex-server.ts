import { ConvexHttpClient } from "convex/browser";

type ConvexHttpClientWithAdminAuth = ConvexHttpClient & {
  setAdminAuth?: (token: string) => void;
};

export const getConvexHttpClient = () => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable.");
  }

  const convex = new ConvexHttpClient(convexUrl) as ConvexHttpClientWithAdminAuth;
  const deployKey = process.env.CONVEX_DEPLOY_KEY;

  if (deployKey && convex.setAdminAuth) {
    convex.setAdminAuth(deployKey);
  }

  return convex;
};
