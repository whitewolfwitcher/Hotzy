import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { PDFDocument } from "pdf-lib";

const mmToPt = (mm: number) => (mm / 25.4) * 72;

export const generatePdfForOrder = action({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(api.orders.getById, { orderId: args.orderId });
    if (!order) throw new Error("Order not found");
    if (!order.wrapFileId) throw new Error("wrapFileId missing");

    const blob = await ctx.storage.get(order.wrapFileId);
    if (!blob) throw new Error("Wrap file not found");
    const bytes = new Uint8Array(await blob.arrayBuffer());

    const pdfDoc = await PDFDocument.create();
    const pageWidth = mmToPt(210);
    const pageHeight = mmToPt(90);
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    let image;
    try {
      image = await pdfDoc.embedPng(bytes);
    } catch {
      image = await pdfDoc.embedJpg(bytes);
    }

    page.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });

    const pdfBytes = await pdfDoc.save();
    const pdfFileId = await ctx.storage.store(
      new Blob([pdfBytes], { type: "application/pdf" })
    );

    await ctx.runMutation(api.orders.attachPdf, { orderId: args.orderId, pdfFileId });
    return { ok: true, pdfFileId };
  },
});