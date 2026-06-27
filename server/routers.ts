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
  getApiUsageStats,
  submitReview,
  getApprovedReviews,
  getAllReviews,
  getReviewCount,
  getApprovedReviewCount,
  approveReview,
  rejectReview,
  deleteReview,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/email";
import { invokeLLM } from "./_core/llm";

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

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1e3a8a;">ข้อความใหม่จากเว็บไซต์</h2>
            <p><strong>ชื่อ:</strong> ${input.name}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> ${input.phone || "-"}</p>
            <p><strong>อีเมล:</strong> ${input.email || "-"}</p>
            <p><strong>บริการที่สนใจ:</strong> ${input.serviceType || "-"}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p><strong>ข้อความ:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${input.message}</p>
          </div>
        `;

        await sendEmail({
          to: "niyomphakjira@gmail.com",
          subject: `ข้อความใหม่จาก ${input.name} - สำนักงานกฎหมายนิตินิยม`,
          html: emailHtml,
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
        const updateData: Record<string, unknown> = { ...data };
        if (data.status === "published") {
          updateData.publishedAt = new Date();
        }
        await updateArticle(id, updateData as Parameters<typeof updateArticle>[1]);
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

  // ===== Public: AI Legal Consultant =====
  aiConsultant: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        // Count user questions - limit to 10 questions
        const userQuestionCount = input.messages.filter((m) => m.role === "user").length;
        
        // If total questions exceed 10, block
        if (userQuestionCount >= 10) {
          return {
            role: "assistant" as const,
            content: "❌ คุณถามครบ 10 คำถามแล้ว ขอบคุณที่ใช้บริการ หากต้องการปรึกษาเพิ่มเติม โปรดติดต่อทนายความโดยตรง",
          };
        }

        const conversationMessages = [
          {
            role: "system" as const,
            content: `คุณคือระบบให้คำปรึกษากฎหมายไทยที่พัฒนาโดย นาย นิยม ดีจันทึก

คำสั่งที่สำคัญ:
1. ตอบแค่หัวข้อกฎหมายเท่านั้น ห้ามตอบเรื่องอื่น
2. ตอบด้วยคำอธิบายที่ละเอียด ชัดเจน และครอบคลุม ไม่จำกัดความยาว
3. ห้ามบอกว่าคุณเป็น AI - บอกว่าพัฒนาโดย นาย นิยม ดีจันทึก
4. ตอบเฉพาะหัวข้อกฎหมายไทยเท่านั้น:
   - กฎหมายแพ่งและพาณิชย์
   - กฎหมายอาญา
   - กฎหมายครอบครัว
   - กฎหมายแรงงาน
   - กฎหมายภาษีอากร
   - กฎหมายทรัพย์สินทางปัญญา
   - กฎหมายการค้า
   - และกฎหมายอื่น ๆ ของไทย

5. ให้คำปรึกษาที่ชัดเจน เข้าใจง่าย
6. หากไม่แน่ใจ บอกให้ชัดเจนว่าไม่แน่ใจ
7. หากคำถามไม่เกี่ยวกับกฎหมายไทย ให้ปฏิเสธสุภาพ`,
          },
          ...input.messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
        ];

        const response = await invokeLLM({
          messages: conversationMessages,
          model: "gemini-2.0-flash",
        });

        const assistantMessage = response.choices[0]?.message?.content || "";

        return {
          role: "assistant" as const,
          content: typeof assistantMessage === "string" ? assistantMessage : JSON.stringify(assistantMessage),
        };
      }),
  }),
  
  // Customer Reviews
  reviews: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "ชื่อจำเป็น"),
        email: z.string().email("อีเมลไม่ถูกต้อง"),
        rating: z.number().min(1).max(5, "ดาวต้องเป็น 1-5"),
        message: z.string().min(10, "ข้อความต้องมีอย่างน้อย 10 ตัวอักษร"),
      }))
      .mutation(async ({ input }) => {
        await submitReview({
          name: input.name,
          email: input.email,
          rating: input.rating,
          message: input.message,
          status: "pending",
        });
        return { success: true };
      }),

    getApproved: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const reviews = await getApprovedReviews(input.limit, input.offset);
        const count = await getApprovedReviewCount();
        return { reviews, count };
      }),

    getAll: adminProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const reviews = await getAllReviews(input.limit, input.offset);
        const count = await getReviewCount();
        return { reviews, count };
      }),

    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await approveReview(input.id);
        return { success: true };
      }),

    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await rejectReview(input.id);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteReview(input.id);
        return { success: true };
      }),
  }),

  // API Usage Dashboard
  apiUsage: router({
    getStats: publicProcedure.query(async () => {
      return await getApiUsageStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
