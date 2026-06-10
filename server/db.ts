import { eq, desc, and, gte, lte, sql, count, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clients,
  cases,
  appointments,
  contactMessages,
  invoices,
  InsertClient,
  InsertCase,
  InsertAppointment,
  InsertContactMessage,
  InsertInvoice,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

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
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Clients =====
export async function getClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

export async function createClient(data: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(clients).values(data);
  return result;
}

export async function updateClient(id: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.update(clients).set(data).where(eq(clients.id, id));
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.delete(clients).where(eq(clients.id, id));
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
  if (!db) return undefined;
  const result = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
  return result[0];
}

export async function createCase(data: InsertCase) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(cases).values(data);
}

export async function updateCase(id: number, data: Partial<InsertCase>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.update(cases).set(data).where(eq(cases.id, id));
}

export async function deleteCase(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.delete(cases).where(eq(cases.id, id));
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
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  return db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, todayStart),
        lte(appointments.appointmentDate, todayEnd)
      )
    )
    .orderBy(appointments.appointmentDate);
}

export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(appointments).values(data);
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.update(appointments).set(data).where(eq(appointments.id, id));
}

export async function deleteAppointment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.delete(appointments).where(eq(appointments.id, id));
}

// ===== Contact Messages =====
export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(contactMessages).values(data);
}

export async function updateContactMessage(id: number, data: Partial<InsertContactMessage>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.update(contactMessages).set(data).where(eq(contactMessages.id, id));
}

// ===== Invoices =====
export async function getInvoices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices).orderBy(desc(invoices.createdAt));
}

export async function createInvoice(data: InsertInvoice) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(invoices).values(data);
}

export async function updateInvoice(id: number, data: Partial<InsertInvoice>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.update(invoices).set(data).where(eq(invoices.id, id));
}

// ===== Dashboard Stats =====
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;

  const [totalClients] = await db.select({ count: count() }).from(clients);
  const [totalCases] = await db.select({ count: count() }).from(cases);
  const [newCases] = await db
    .select({ count: count() })
    .from(cases)
    .where(eq(cases.status, "new"));
  const [totalRevenue] = await db
    .select({ total: sum(invoices.paidAmount) })
    .from(invoices)
    .where(eq(invoices.status, "paid"));
  const [pendingMessages] = await db
    .select({ count: count() })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const [todayAppointments] = await db
    .select({ count: count() })
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, todayStart),
        lte(appointments.appointmentDate, todayEnd)
      )
    );

  return {
    totalClients: totalClients?.count ?? 0,
    totalCases: totalCases?.count ?? 0,
    newCases: newCases?.count ?? 0,
    totalRevenue: Number(totalRevenue?.total ?? 0),
    pendingMessages: pendingMessages?.count ?? 0,
    todayAppointments: todayAppointments?.count ?? 0,
  };
}

export async function getMonthlyRevenue() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.execute(sql`
    SELECT 
      DATE_FORMAT(createdAt, '%Y-%m') as month,
      SUM(CAST(paidAmount AS DECIMAL(12,2))) as revenue,
      COUNT(*) as count
    FROM invoices
    WHERE status = 'paid'
    GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `);
  return (result[0] as unknown) as Array<{ month: string; revenue: number; count: number }>;
}

export async function getCaseTypeStats() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.execute(sql`
    SELECT type, COUNT(*) as count
    FROM cases
    GROUP BY type
  `);
  return (result[0] as unknown) as Array<{ type: string; count: number }>;
}
