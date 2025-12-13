import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// ==============================
// Auth tables for better-auth
// ==============================

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ==============================
// E-commerce tables (Orders/Payments)
// ==============================

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), // uuid
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // optional
  email: text("email").notNull(),

  status: text("status").notNull(), // pending_payment|paid|payment_failed|fulfilled|cancelled|refunded
  amountTotal: integer("amount_total").notNull(), // cents
  currency: text("currency").notNull(), // 'cad'

  shippingName: text("shipping_name"),
  shippingLine1: text("shipping_line1"),
  shippingCity: text("shipping_city"),
  shippingState: text("shipping_state"),
  shippingPostal: text("shipping_postal"),
  shippingCountry: text("shipping_country"),

  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(), // uuid
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  sku: text("sku"),
  name: text("name").notNull(),
  unitAmount: integer("unit_amount").notNull(), // cents
  quantity: integer("quantity").notNull(),
  metadataJson: text("metadata_json"), // optional JSON string

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(), // uuid
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  provider: text("provider").notNull(), // 'stripe'
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),

  amount: integer("amount").notNull(), // cents
  currency: text("currency").notNull(),
  status: text("status").notNull(), // processing|succeeded|failed|refunded

  failureCode: text("failure_code"),
  failureMessage: text("failure_message"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Idempotency table for Stripe webhook retries
export const stripeEvents = sqliteTable("stripe_events", {
  eventId: text("event_id").primaryKey(),
  type: text("type").notNull(),
  created: integer("created").notNull(), // unix timestamp from Stripe event
  livemode: integer("livemode", { mode: "boolean" }).notNull(),
  processedAt: integer("processed_at", { mode: "timestamp" }),
});
