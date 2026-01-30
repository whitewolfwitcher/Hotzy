"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ConvexTestPage() {
  const data = useQuery(api.health.ping);

  return (
    <main style={{ padding: 24 }}>
      <h1>Convex Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}