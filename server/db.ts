import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  contactMessages,
  articles,
  InsertContactMessage,
  InsertArticle,
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

// ===== Contact Messages =====
export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) return;
  await db.insert(contactMessages).values(data);
}

// ===== Articles =====
export async function getArticles(status?: "published" | "draft" | "archived") {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(articles).orderBy(desc(articles.publishedAt));
  if (status) {
    return db
      .select()
      .from(articles)
      .where(eq(articles.status, status))
      .orderBy(desc(articles.publishedAt));
  }
  return query;
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
