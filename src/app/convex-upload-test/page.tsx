"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ConvexUploadTestPage() {
  const createDraft = useMutation(api.orders.createDraft);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const attachWrap = useMutation(api.orders.attachWrap);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [wrapFileId, setWrapFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setStatus("Creating draft order...");
    const draft = await createDraft({ cupType: "hotzy", currency: "CAD" });
    setOrderId(draft.orderId as string);

    setStatus("Requesting upload URL...");
    const uploadUrl = await generateUploadUrl({});

    setStatus("Uploading file...");
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: file,
    });
    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status}`);
    }
    const uploadJson = (await uploadRes.json()) as { storageId?: string; fileId?: string };
    const storageId = uploadJson.storageId ?? uploadJson.fileId;
    if (!storageId) {
      throw new Error("No storageId returned from upload");
    }
    setWrapFileId(storageId);

    setStatus("Attaching wrap to order...");
    await attachWrap({ orderId: draft.orderId, wrapFileId: storageId });
    setStatus("Done");
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Convex Upload Test</h1>
      <p>Upload a PNG to attach it to a draft order.</p>
      <input
        type="file"
        accept="image/png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          handleFile(file).catch((err) => setError(err.message));
        }}
      />
      <div style={{ marginTop: 16 }}>
        <div>Status: {status || "idle"}</div>
        <div>OrderId: {orderId ?? "-"}</div>
        <div>WrapFileId: {wrapFileId ?? "-"}</div>
        {error ? <pre style={{ color: "crimson" }}>{error}</pre> : null}
      </div>
    </main>
  );
}