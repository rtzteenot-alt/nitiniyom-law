import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ===== CRM Tables =====

export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  idCard: varchar("idCard", { length: 20 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

export const cases = mysqlTable("cases", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  caseNumber: varchar("caseNumber", { length: 50 }),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "criminal",
    "civil",
    "contract",
    "debt_collection",
    "consultation",
    "other",
  ]).notNull(),
  status: mysqlEnum("status", [
    "new",
    "in_progress",
    "pending",
    "closed",
    "cancelled",
  ])
    .default("new")
    .notNull(),
  description: text("description"),
  fee: decimal("fee", { precision: 12, scale: 2 }),
  startDate: date("startDate"),
  closeDate: date("closeDate"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Case = typeof cases.$inferSelect;
export type InsertCase = typeof cases.$inferInsert;

export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  clientName: varchar("clientName", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  caseId: int("caseId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  appointmentDate: timestamp("appointmentDate").notNull(),
  duration: int("duration").default(60),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"])
    .default("scheduled")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  serviceType: varchar("serviceType", { length: 100 }),
  status: mysqlEnum("status", ["new", "read", "replied", "closed"])
    .default("new")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  caseId: int("caseId"),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: decimal("paidAmount", { precision: 12, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["pending", "partial", "paid", "overdue", "cancelled"])
    .default("pending")
    .notNull(),
  dueDate: date("dueDate"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  author: varchar("author", { length: 255 }).default("สำนักงานกฎหมายนิตินิยม"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

// ===== API Usage Tracking =====

export const apiUsageLogs = mysqlTable("api_usage_logs", {
  id: int("id").autoincrement().primaryKey(),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  method: varchar("method", { length: 20 }).notNull(),
  status: int("status"),
  responseTime: int("responseTime"), // milliseconds
  tokensUsed: int("tokensUsed").default(0),
  model: varchar("model", { length: 100 }),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApiUsageLog = typeof apiUsageLogs.$inferSelect;
export type InsertApiUsageLog = typeof apiUsageLogs.$inferInsert;


// ===== Customer Reviews =====

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
