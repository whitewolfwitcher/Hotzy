import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createDraft = mutation({
  args: {
    cupType: v.union(v.literal("hotzy"), v.literal("standard")),
    currency: v.union(v.literal("CAD"), v.literal("USD")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("orders", {
      status: "draft",
      cupType: args.cupType,
      currency: args.currency,
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