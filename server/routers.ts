import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getCases,
  getCasesByClientId,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  getAppointments,
  getTodayAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getContactMessages,
  createContactMessage,
  updateContactMessage,
  getInvoices,
  createInvoice,
  updateInvoice,
  getDashboardStats,
  getMonthlyRevenue,
  getCaseTypeStats,
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./db";
import { notifyOwner } from "./_core/notification";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== Public: Contact Form =====
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().optional(),
          email: z.string().email().optional().or(z.literal("")),
          subject: z.string().optional(),
          message: z.string().min(1),
          serviceType: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createContactMessage({
          name: input.name,
          phone: input.phone ?? null,
          email: input.email || null,
          subject: input.subject ?? null,
          message: input.message,
          serviceType: input.serviceType ?? null,
        });
        await notifyOwner({
          title: `ข้อความใหม่จาก ${input.name}`,
          content: `เบอร์: ${input.phone ?? "-"}\nบริการ: ${input.serviceType ?? "-"}\nข้อความ: ${input.message}`,
        });
        return { success: true };
      }),
  }),

  // ===== Admin: Clients =====
  clients: router({
    list: adminProcedure.query(() => getClients()),
    byId: adminProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      getClientById(input.id)
    ),
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().optional(),
          email: z.string().optional(),
          address: z.string().optional(),
          idCard: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createClient({
          name: input.name,
          phone: input.phone ?? null,
          email: input.email ?? null,
          address: input.address ?? null,
          idCard: input.idCard ?? null,
          notes: input.notes ?? null,
        });
        return { success: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          address: z.string().optional(),
          idCard: z.string().optional(),
          notes: z.string().optional(),
          status: z.enum(["active", "inactive"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateClient(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteClient(input.id);
        return { success: true };
      }),
  }),

  // ===== Admin: Cases =====
  cases: router({
    list: adminProcedure.query(() => getCases()),
    byClientId: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .query(({ input }) => getCasesByClientId(input.clientId)),
    byId: adminProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      getCaseById(input.id)
    ),
    create: adminProcedure
      .input(
        z.object({
          clientId: z.number(),
          caseNumber: z.string().optional(),
          title: z.string().min(1),
          type: z.enum(["criminal", "civil", "contract", "debt_collection", "consultation", "other"]),
          description: z.string().optional(),
          fee: z.string().optional(),
          startDate: z.string().optional(),
          assignedTo: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createCase({
          clientId: input.clientId,
          caseNumber: input.caseNumber ?? null,
          title: input.title,
          type: input.type,
          description: input.description ?? null,
          fee: input.fee ?? null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          assignedTo: input.assignedTo ?? null,
        });
        return { success: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          type: z.enum(["criminal", "civil", "contract", "debt_collection", "consultation", "other"]).optional(),
          status: z.enum(["new", "in_progress", "pending", "closed", "cancelled"]).optional(),
          description: z.string().optional(),
          fee: z.string().optional(),
          assignedTo: z.string().optional(),
          closeDate: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, closeDate, ...rest } = input;
        await updateCase(id, {
          ...rest,
          closeDate: closeDate ? new Date(closeDate) : undefined,
        });
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCase(input.id);
        return { success: true };
      }),
  }),

  // ===== Admin: Appointments =====
  appointments: router({
    list: adminProcedure.query(() => getAppointments()),
    today: adminProcedure.query(() => getTodayAppointments()),
    create: adminProcedure
      .input(
        z.object({
          clientId: z.number().optional(),
          clientName: z.string().optional(),
          phone: z.string().optional(),
          caseId: z.number().optional(),
          title: z.string().min(1),
          description: z.string().optional(),
          appointmentDate: z.string(),
          duration: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createAppointment({
          clientId: input.clientId ?? null,
          clientName: input.clientName ?? null,
          phone: input.phone ?? null,
          caseId: input.caseId ?? null,
          title: input.title,
          description: input.description ?? null,
          appointmentDate: new Date(input.appointmentDate),
          duration: input.duration ?? 60,
        });
        return { success: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          appointmentDate: z.string().optional(),
          duration: z.number().optional(),
          status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, appointmentDate, ...rest } = input;
        await updateAppointment(id, {
          ...rest,
          appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
        });
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteAppointment(input.id);
        return { success: true };
      }),
  }),

  // ===== Admin: Contact Messages =====
  messages: router({
    list: adminProcedure.query(() => getContactMessages()),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "read", "replied", "closed"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateContactMessage(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // ===== Admin: Invoices =====
  invoices: router({
    list: adminProcedure.query(() => getInvoices()),
    create: adminProcedure
      .input(
        z.object({
          clientId: z.number(),
          caseId: z.number().optional(),
          invoiceNumber: z.string().optional(),
          amount: z.string(),
          paidAmount: z.string().optional(),
          status: z.enum(["pending", "partial", "paid", "overdue", "cancelled"]).optional(),
          dueDate: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createInvoice({
          clientId: input.clientId,
          caseId: input.caseId ?? null,
          invoiceNumber: input.invoiceNumber ?? null,
          amount: input.amount,
          paidAmount: input.paidAmount ?? "0",
          status: input.status ?? "pending",
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          description: input.description ?? null,
        });
        return { success: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          paidAmount: z.string().optional(),
          status: z.enum(["pending", "partial", "paid", "overdue", "cancelled"]).optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateInvoice(id, data);
        return { success: true };
      }),
  }),

  // ===== Public: Articles (Blog) =====
  articles: router({
    list: publicProcedure.query(async () => {
      const all = await getArticles("published");
      return all;
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) =>
      getArticleBySlug(input.slug)
    ),
  }),

  // ===== Admin: Articles Management =====
  articlesAdmin: router({
    list: adminProcedure.query(() => getArticles()),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string().min(1),
          category: z.string().min(1),
          status: z.enum(["draft", "published", "archived"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createArticle({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt ?? null,
          content: input.content,
          category: input.category,
          status: input.status ?? "draft",
          publishedAt: input.status === "published" ? new Date() : null,
        });
        return { success: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          category: z.string().optional(),
          status: z.enum(["draft", "published", "archived"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === "published") {
          updateData.publishedAt = new Date();
        }
        await updateArticle(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteArticle(input.id);
        return { success: true };
      }),
  }),

  // ===== Admin: Dashboard =====
  dashboard: router({
    stats: adminProcedure.query(() => getDashboardStats()),
    monthlyRevenue: adminProcedure.query(() => getMonthlyRevenue()),
    caseTypeStats: adminProcedure.query(() => getCaseTypeStats()),
    recentCases: adminProcedure.query(async () => {
      const all = await getCases();
      return all.slice(0, 10);
    }),
    todayAppointments: adminProcedure.query(() => getTodayAppointments()),
  }),
});

export type AppRouter = typeof appRouter;
