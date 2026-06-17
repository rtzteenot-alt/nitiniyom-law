import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  createContactMessage,
  getArticles,
  getArticleBySlug,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/email";

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

        // Send email to niyomphakjira@gmail.com
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
});

export type AppRouter = typeof appRouter;
