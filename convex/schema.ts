import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    status: v.union(
      v.literal("draft"),
      v.literal("paid"),
      v.literal("pdf_ready"),
      v.literal("failed")
    ),

    cupType: v.union(v.literal("hotzy"), v.literal("standard")),
    currency: v.union(v.literal("CAD"), v.literal("USD")),
    quantity: v.optional(v.number()),
    amount: v.optional(v.number()),

    stripePaymentIntentId: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    commandNumber: v.optional(v.string()),

    wrapFileId: v.optional(v.id("_storage")),
    pdfFileId: v.optional(v.id("_storage")),

    emailSent: v.optional(v.boolean()),
    emailSentAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_payment_intent", ["stripePaymentIntentId"]),
});
