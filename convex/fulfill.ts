import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const fulfillFromStripe = action({
  args: { paymentIntentId: v.string(), orderId: v.optional(v.id("orders")) },
  handler: async (ctx, args) => {
    const order = args.orderId
      ? await ctx.runQuery(api.orders.getById, { orderId: args.orderId })
      : await ctx.runQuery(api.orders.getByPaymentIntent, {
          stripePaymentIntentId: args.paymentIntentId,
        });

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.runMutation(api.orders.markPaidFromStripe, {
      orderId: order._id,
      stripePaymentIntentId: args.paymentIntentId,
    });

    if (order.wrapFileId && !order.pdfFileId) {
      await ctx.runAction(api.print.generatePdfForOrder, { orderId: order._id });
    }

    const updated = await ctx.runQuery(api.orders.getById, { orderId: order._id });

    return {
      ok: true,
      orderId: order._id,
      pdfFileId: updated?.pdfFileId ?? null,
      cupType: updated?.cupType ?? order.cupType,
      currency: updated?.currency ?? order.currency,
      emailSent: updated?.emailSent ?? false,
    };
  },
});