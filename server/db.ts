import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clients,
  cases,
  appointments,
  contactMessages,
  invoices,
  articles,
  apiUsageLogs,
  InsertClient,
  InsertCase,
  InsertAppointment,
  InsertContactMessage,
  InsertInvoice,
  InsertArticle,
  InsertApiUsageLog,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== Users =====
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn ?? undefined;
      updateSet["lastSignedIn"] = user.lastSignedIn ?? null;
    }
    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.warn("[Database] upsertUser failed:", error);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0] ?? null;
}

// ===== Clients =====
export async function getClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createClient(data: InsertClient) {
  const db = await getDb();
  if (!db) return;
  await db.insert(clients).values(data);
}

export async function updateClient(id: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) return;
  await db.update(clients).set(data).where(eq(clients.id, id));
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(clients).where(eq(clients.id, id));
}

// ===== Cases =====
export async function getCases() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cases).orderBy(desc(cases.createdAt));
}

export async function getCasesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cases).where(eq(cases.clientId, clientId)).orderBy(desc(cases.createdAt));
}

export async function getCaseById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createCase(data: InsertCase) {
  const db = await getDb();
  if (!db) return;
  await db.insert(cases).values(data);
}

export async function updateCase(id: number, data: Partial<InsertCase>) {
  const db = await getDb();
  if (!db) return;
  await db.update(cases).set(data).where(eq(cases.id, id));
}

export async function deleteCase(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cases).where(eq(cases.id, id));
}

// ===== Appointments =====
export async function getAppointments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
}

export async function getTodayAppointments() {
  const db = await getDb();
  if (!db) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, today),
        lte(appointments.appointmentDate, tomorrow)
      )
    )
    .orderBy(appointments.appointmentDate);
}

export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) return;
  await db.insert(appointments).values(data);
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) return;
  await db.update(appointments).set(data).where(eq(appointments.id, id));
}

export async function deleteAppointment(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(appointments).where(eq(appointments.id, id));
}

// ===== Contact Messages =====
export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) return;
  await db.insert(contactMessages).values(data);
}

export async function updateContactMessage(id: number, data: Partial<InsertContactMessage>) {
  const db = await getDb();
  if (!db) return;
  await db.update(contactMessages).set(data).where(eq(contactMessages.id, id));
}

// ===== Invoices =====
export async function getInvoices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices).orderBy(desc(invoices.createdAt));
}

export async function createInvoice(data: InsertInvoice) {
  const db = await getDb();
  if (!db) return;
  await db.insert(invoices).values(data);
}

export async function updateInvoice(id: number, data: Partial<InsertInvoice>) {
  const db = await getDb();
  if (!db) return;
  await db.update(invoices).set(data).where(eq(invoices.id, id));
}

// ===== Dashboard Stats =====
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalClients: 0, activeCases: 0, totalRevenue: 0, todayAppointments: 0, newMessages: 0 };

  const [clientCount] = await db.select({ count: sql<number>`count(*)` }).from(clients);
  const [caseCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cases)
    .where(eq(cases.status, "in_progress"));
  const [revenueSum] = await db
    .select({ total: sql<string>`COALESCE(SUM(paidAmount), 0)` })
    .from(invoices);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [apptCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, today),
        lte(appointments.appointmentDate, tomorrow)
      )
    );
  const [msgCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));

  return {
    totalClients: Number(clientCount?.count ?? 0),
    activeCases: Number(caseCount?.count ?? 0),
    totalRevenue: Number(revenueSum?.total ?? 0),
    todayAppointments: Number(apptCount?.count ?? 0),
    newMessages: Number(msgCount?.count ?? 0),
  };
}

export async function getMonthlyRevenue() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.execute(
    sql`SELECT DATE_FORMAT(createdAt, '%Y-%m') as month, SUM(paidAmount) as revenue
        FROM invoices
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month ASC`
  );
  return (rows[0] as unknown as Array<{ month: string; revenue: string }>).map((r) => ({
    month: r.month,
    revenue: Number(r.revenue ?? 0),
  }));
}

export async function getCaseTypeStats() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.execute(
    sql`SELECT type, COUNT(*) as count FROM cases GROUP BY type`
  );
  return (rows[0] as unknown as Array<{ type: string; count: string }>).map((r) => ({
    type: r.type,
    count: Number(r.count),
  }));
}

// ===== Articles =====
export async function getArticles(status?: "published" | "draft" | "archived") {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db
      .select()
      .from(articles)
      .where(eq(articles.status, status))
      .orderBy(desc(articles.publishedAt));
  }
  return db.select().from(articles).orderBy(desc(articles.publishedAt));
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) return;
  await db.insert(articles).values(data);
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) return;
  await db.update(articles).set(data).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(articles).where(eq(articles.id, id));
}


// ===== API Usage Tracking =====
export async function logApiUsage(data: InsertApiUsageLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(apiUsageLogs).values(data);
}

export async function getApiUsageStats() {
  const db = await getDb();
  if (!db) return null;

  const logs = await db.select().from(apiUsageLogs);

  const stats = {
    totalRequests: logs.length,
    totalTokensUsed: logs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0),
    averageResponseTime: logs.length > 0
      ? Math.round(logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / logs.length)
      : 0,
    requestsByEndpoint: {} as Record<string, number>,
    requestsByModel: {} as Record<string, number>,
    recentRequests: logs.slice(-10).reverse(),
  };

  logs.forEach(log => {
    if (log.endpoint) {
      stats.requestsByEndpoint[log.endpoint] = (stats.requestsByEndpoint[log.endpoint] || 0) + 1;
    }
    if (log.model) {
      stats.requestsByModel[log.model] = (stats.requestsByModel[log.model] || 0) + 1;
    }
  });

  return stats;
}
