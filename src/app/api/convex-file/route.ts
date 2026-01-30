import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return new Response("Missing NEXT_PUBLIC_CONVEX_URL", { status: 500 });
  }

  const client = new ConvexHttpClient(convexUrl);
  const fileUrl = await client.query(api.files.getFileUrl, { storageId: id as any });
  if (!fileUrl) {
    return new Response("File not found", { status: 404 });
  }

  const upstream = await fetch(fileUrl);
  if (!upstream.ok) {
    return new Response("Failed to fetch file", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  const headers = new Headers({ "Content-Type": contentType });

  if (upstream.body) {
    return new Response(upstream.body, { status: 200, headers });
  }

  const buffer = await upstream.arrayBuffer();
  return new Response(buffer, { status: 200, headers });
}
