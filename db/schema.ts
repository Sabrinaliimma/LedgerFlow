import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  createdAt: text("created_at").notNull(),
}, (t) => [uniqueIndex("idx_customers_email").on(t.email)]);

export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  cadence: text("cadence").notNull(),
  active: integer("active").notNull().default(1),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  planId: text("plan_id").notNull().references(() => plans.id),
  status: text("status").notNull(),
  startedAt: text("started_at").notNull(),
  periodEnd: text("period_end").notNull(),
  canceledAt: text("canceled_at"),
}, (t) => [index("idx_subscriptions_customer").on(t.customerId)]);

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  number: text("number").notNull(),
  subscriptionId: text("subscription_id").notNull().references(() => subscriptions.id),
  customerId: text("customer_id").notNull().references(() => customers.id),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull(),
  issuedAt: text("issued_at").notNull(),
  dueAt: text("due_at").notNull(),
  paidAt: text("paid_at"),
}, (t) => [index("idx_invoices_customer").on(t.customerId), uniqueIndex("idx_invoices_number").on(t.number)]);

export const paymentEvents = sqliteTable("payment_events", {
  id: text("id").primaryKey(),
  eventKey: text("event_key").notNull(),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  type: text("type").notNull(),
  createdAt: text("created_at").notNull(),
}, (t) => [uniqueIndex("idx_payment_events_key").on(t.eventKey), index("idx_payment_events_invoice").on(t.invoiceId)]);
