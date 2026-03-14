import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUnitAmount } from "../src/lib/pricing";

export const createDraft = mutation({
  args: {
    cupType: v.union(v.literal("hotzy"), v.literal("standard")),
    currency: v.union(v.literal("CAD"), v.literal("USD")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const amount = getUnitAmount(args.cupType, args.currency);
    const id = await ctx.db.insert("orders", {
      status: "draft",
      cupType: args.cupType,
      currency: args.currency,
      amount,
      createdAt: now,
      updatedAt: now,
    });
    return { orderId: id };
  },
});

export const attachWrap = mutation({
  args: { orderId: v.id("orders"), wrapFileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(args.orderId, { wrapFileId: args.wrapFileId, updatedAt: now });
    return { ok: true };
  },
});

export const attachPdf = mutation({
  args: { orderId: v.id("orders"), pdfFileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    const nextStatus = order.status === "paid" ? "pdf_ready" : order.status;
    await ctx.db.patch(args.orderId, {
      pdfFileId: args.pdfFileId,
      status: nextStatus,
      updatedAt: now,
    });
    return { ok: true };
  },
});

export const getByPaymentIntent = query({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_payment_intent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId)
      )
      .unique();
  },
});

export const getForPayment = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    return {
      cupType: order.cupType,
      currency: order.currency,
      amount: order.amount ?? getUnitAmount(order.cupType, order.currency),
      stripePaymentIntentId: order.stripePaymentIntentId ?? null,
      status: order.status,
    };
  },
});

export const setPaymentIntent = mutation({
  args: { orderId: v.id("orders"), stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(args.orderId, {
      stripePaymentIntentId: args.stripePaymentIntentId,
      updatedAt: now,
    });
    return { ok: true };
  },
});

export const setCustomerInfo = mutation({
  args: {
    orderId: v.id("orders"),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});

export const setCommandNumber = mutation({
  args: {
    orderId: v.id("orders"),
    commandNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      commandNumber: args.commandNumber,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});

export const markPaidFromStripe = mutation({
  args: { orderId: v.id("orders"), stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(args.orderId, {
      status: "paid",
      stripePaymentIntentId: args.stripePaymentIntentId,
      updatedAt: now,
    });
    return { ok: true };
  },
});

export const markPaidByPaymentIntent = mutation({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const order = await ctx.db
      .query("orders")
      .withIndex("by_payment_intent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId)
      )
      .unique();

    if (!order) {
      throw new Error(
        `Order not found for stripePaymentIntentId: ${args.stripePaymentIntentId}`
      );
    }

    await ctx.db.patch(order._id, {
      status: "paid",
      updatedAt: now,
    });

    return { ok: true, orderId: order._id };
  },
});

export const markEmailSent = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.emailSent) {
      return { ok: true, alreadySent: true };
    }
    await ctx.db.patch(args.orderId, {
      emailSent: true,
      emailSentAt: now,
      updatedAt: now,
    });
    return { ok: true, alreadySent: false };
  },
});

export const getById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});
