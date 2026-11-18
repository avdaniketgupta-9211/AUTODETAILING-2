import { pgTable, serial, text, timestamp, varchar, index } from "drizzle-orm/pg-core";

export const inquiries = pgTable(
  "inquiries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 30 }),
    vehicle: varchar("vehicle", { length: 120 }),
    service: varchar("service", { length: 80 }).notNull(),
    message: text("message").notNull(),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("inquiries_ip_created_idx").on(t.ipHash, t.createdAt)],
);

export type Inquiry = typeof inquiries.$inferSelect;
