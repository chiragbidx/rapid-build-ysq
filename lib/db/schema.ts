import { pgTable, text, timestamp, uniqueIndex, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ==== Existing Tables unchanged for users, teams, teamMembers, teamInvitations ====
// Kept for backward compatibility while migrating to Merchant Account structure

export const users = pgTable("users", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const merchantAccounts = pgTable("merchant_accounts", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  name: text("name").notNull(),
  businessEmail: text("business_email").notNull(),
  status: text("status").notNull().default("pending"), // pending, active, suspended
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const merchantAccountMembers = pgTable(
  "merchant_account_members",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
    merchantAccountId: text("merchant_account_id")
      .notNull()
      .references(() => merchantAccounts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("owner"), // owner, admin, viewer
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("merchant_account_member_user").on(table.merchantAccountId, table.userId)]
);

// Customer entity for a Merchant Account (tenant)
export const customers = pgTable("customers", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  merchantAccountId: text("merchant_account_id")
    .notNull()
    .references(() => merchantAccounts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  billingAddress: text("billing_address"),
  paymentMethodData: jsonb("payment_method_data").default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Payments — link to customer & merchant, simulate processing
export const payments = pgTable("payments", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  merchantAccountId: text("merchant_account_id")
    .notNull()
    .references(() => merchantAccounts.id, { onDelete: "cascade" }),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("created"), // created, succeeded, failed, refunded
  source: text("source"),
  reference: text("reference"),
  captured: boolean("captured").default(true),
  refundedAmount: numeric("refunded_amount", { precision: 12, scale: 2 }).default("0.00"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Invoices — link to merchant, customer, and (optionally) payment
export const invoices = pgTable("invoices", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  merchantAccountId: text("merchant_account_id")
    .notNull()
    .references(() => merchantAccounts.id, { onDelete: "cascade" }),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "set null" }),
  paymentId: text("payment_id").references(() => payments.id, { onDelete: "set null" }),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, paid, overdue, void
  lineItems: jsonb("line_items").notNull().default("[]"), // [{description, quantity, unit_price}]
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  notes: text("notes"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Payouts — simulate summary of payments "settled" to merchant's account
export const payouts = pgTable("payouts", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  merchantAccountId: text("merchant_account_id")
    .notNull()
    .references(() => merchantAccounts.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, succeeded, failed
  destination: text("destination").notNull(), // demo bank account (string for MVP)
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Activity Logs — actions across entities, for dashboard feed/audit
export const activityLogs = pgTable("activity_logs", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  merchantAccountId: text("merchant_account_id")
    .notNull()
    .references(() => merchantAccounts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  entity: text("entity").notNull(), // payment, invoice, customer, payout, etc.
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(), // created, updated, refunded, paid, etc.
  metadata: jsonb("metadata").default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Retain old featureItems for scaffold/legacy demo
export const featureItems = pgTable("feature_items", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});