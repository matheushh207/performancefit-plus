import { COOKIE_NAME } from "@shared/const";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, professionalProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { insights, students, workouts, diets, physicalEvaluations, professionals } from "../drizzle/schema";
import { and, eq, sql } from "drizzle-orm";

const insightsRouter = router({
  list: professionalProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(insights)
        .where(eq(insights.professionalId, ctx.professional.professionalId));
    } catch (error) {
      console.error("❌ Erro ao listar insights:", error);
      return [];
    }
  }),

  applyInsight: professionalProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("DB not available");
        await db
          .update(insights)
          .set({ isResolved: true, resolvedAt: new Date() })
          .where(
            and(
              eq(insights.id, input.id),
              eq(insights.professionalId, ctx.professional.professionalId),
            ),
          );
        return { success: true };
      } catch (error) {
        console.error("❌ Erro ao aplicar insight:", error);
        throw error;
      }
    }),

  getStats: professionalProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return { activeStudents: 0, pendingAlerts: 0, resolvedAlerts: 0, successRate: 0, retentionRate: 0 };
    }

    const [studentRow] = await db
      .select({ value: sql<number>`count(*)` })
      .from(students)
      .where(eq(students.professionalId, ctx.professional.professionalId));

    const [pendingRow] = await db
      .select({ value: sql<number>`count(*)` })
      .from(insights)
      .where(
        and(
          eq(insights.professionalId, ctx.professional.professionalId),
          eq(insights.isResolved, false),
        ),
      );

    const [resolvedRow] = await db
      .select({ value: sql<number>`count(*)` })
      .from(insights)
      .where(
        and(
          eq(insights.professionalId, ctx.professional.professionalId),
          eq(insights.isResolved, true),
        ),
      );

    return {
      activeStudents: studentRow?.value ?? 0,
      pendingAlerts: pendingRow?.value ?? 0,
      resolvedAlerts: resolvedRow?.value ?? 0,
      successRate: 80,
      retentionRate: 87,
    };
  }),
});

const studentsRouter = router({
  list: professionalProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(students)
        .where(eq(students.professionalId, ctx.professional.professionalId));
    } catch (error) {
      return [];
    }
  }),

  create: professionalProcedure
    .input(z.object({ fullName: z.string(), email: z.string().email().optional(), cpf: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("🚀 Tentando cadastrar ALUNO:", input.fullName);
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      try {
        const [result] = await db
          .insert(students)
          .values({
            fullName: input.fullName,
            email: input.email || "",
            cpf: input.cpf,
            professionalId: ctx.professional.professionalId,
            isActive: true,
            phone: "",
            objective: "",
            notes: ""
          });

        console.log("✅ Aluno cadastrado com sucesso! ID:", result.insertId);

        const [created] = await db
          .select()
          .from(students)
          .where(eq(students.id, result.insertId))
          .limit(1);

        return created;
      } catch (error: any) {
        console.error("❌ ERRO AO CADASTRAR ALUNO:", error.message);
        throw new Error(`Erro no banco (Aluno): ${error.message}`);
      }
    }),
});

const workoutsRouter = router({
  list: professionalProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(workouts)
        .where(eq(workouts.professionalId, ctx.professional.professionalId));
    } catch (error) {
      return [];
    }
  }),

  create: professionalProcedure
    .input(z.object({ studentId: z.number(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("🚀 Tentando cadastrar TREINO:", input.name);
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      try {
        const [result] = await db
          .insert(workouts)
          .values({
            studentId: input.studentId,
            professionalId: ctx.professional.professionalId,
            name: input.name,
            type: "hypertrophy",
            isActive: true,
            notes: ""
          });

        console.log("✅ Treino cadastrado com sucesso! ID:", result.insertId);

        const [created] = await db
          .select()
          .from(workouts)
          .where(eq(workouts.id, result.insertId))
          .limit(1);

        return created;
      } catch (error: any) {
        console.error("❌ ERRO AO CADASTRAR TREINO:", error.message);
        throw new Error(`Erro no banco (Treino): ${error.message}`);
      }
    }),
});

const nutritionRouter = router({
  list: professionalProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(diets)
        .where(eq(diets.professionalId, ctx.professional.professionalId));
    } catch (error) {
      return [];
    }
  }),

  create: professionalProcedure
    .input(z.object({ studentId: z.number(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("🚀 Tentando cadastrar DIETA:", input.name);
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      try {
        const [result] = await db
          .insert(diets)
          .values({
            studentId: input.studentId,
            professionalId: ctx.professional.professionalId,
            name: input.name,
            type: "maintenance",
            isActive: true,
            notes: ""
          });

        console.log("✅ Dieta cadastrada com sucesso! ID:", result.insertId);

        const [created] = await db
          .select()
          .from(diets)
          .where(eq(diets.id, result.insertId))
          .limit(1);

        return created;
      } catch (error: any) {
        console.error("❌ ERRO AO CADASTRAR DIETA:", error.message);
        throw new Error(`Erro no banco (Dieta): ${error.message}`);
      }
    }),
});

const dashboardRouter = router({
  getStats: professionalProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return { studentCount: 0, workoutCount: 0, dietCount: 0, insightCount: 0 };
    }

    const [studentRow] = await db
      .select({ value: sql<number>`count(*)` })
      .from(students)
      .where(eq(students.professionalId, ctx.professional.professionalId));

    const [workoutRow] = await db
      .select({ value: sql<number>`count(*)` })
      .from(workouts)
      .where(eq(workouts.professionalId, ctx.professional.professionalId));

    const [dietRow] = await db
      .select({ value: sql<number>`count(*)` })
      .from(diets)
      .where(eq(diets.professionalId, ctx.professional.professionalId));

    const [insightRow] = await db
      .select({ value: sql<number>`count(*)` })
      .from(insights)
      .where(eq(insights.professionalId, ctx.professional.professionalId));

    return {
      studentCount: studentRow?.value ?? 0,
      workoutCount: workoutRow?.value ?? 0,
      dietCount: dietRow?.value ?? 0,
      insightCount: insightRow?.value ?? 0,
    };
  }),
});

const professionalsRouter = router({
  list: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(professionals).where(eq(professionals.isActive, true));
    } catch (error) {
      console.error("❌ Erro ao listar profissionais:", error);
      return [];
    }
  }),

  create: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(3),
        email: z.string().email(),
        cpf: z.string().min(11),
        phone: z.string().optional(),
        type: z.enum(["personal_trainer", "nutritionist", "both"]),
        specialization: z.string().optional(),
        licenseNumber: z.string().optional(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("🚀 Tentando cadastrar PROFISSIONAL:", input.email);
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      try {
        const [existing] = await db
          .select()
          .from(professionals)
          .where(
            sql`${professionals.email} = ${input.email} OR ${professionals.cpf} = ${input.cpf}`,
          )
          .limit(1);

        if (existing) {
          throw new Error("EMAIL_OR_CPF_ALREADY_EXISTS");
        }

        const passwordHash = await bcrypt.hash(input.password, 10);

        const [result] = await db
          .insert(professionals)
          .values({
            fullName: input.fullName,
            email: input.email,
            cpf: input.cpf,
            phone: input.phone || "",
            type: input.type,
            specialization: input.specialization || "",
            licenseNumber: input.licenseNumber || "",
            passwordHash: passwordHash,
            isActive: true,
          });

        console.log("✅ Profissional cadastrado com sucesso! ID:", result.insertId);

        const [created] = await db
          .select()
          .from(professionals)
          .where(eq(professionals.id, result.insertId))
          .limit(1);

        return {
          id: created.id,
          fullName: created.fullName,
          email: created.email,
          type: created.type,
        };
      } catch (error: any) {
        console.error("❌ ERRO AO CADASTRAR PROFISSIONAL:", error.message);
        throw new Error(`Erro no banco (Profissional): ${error.message}`);
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      await db
        .update(professionals)
        .set({ isActive: false })
        .where(eq(professionals.id, input.id));

      return { success: true };
    }),
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
    loginProfessional: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const [professional] = await db
          .select()
          .from(professionals)
          .where(eq(professionals.email, input.email))
          .limit(1);

        if (!professional || !professional.passwordHash) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const passwordOk = await bcrypt.compare(
          input.password,
          professional.passwordHash,
        );

        if (!passwordOk) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!professional.isActive) {
          throw new Error("ACCOUNT_INACTIVE");
        }

        const secret = new TextEncoder().encode(
          process.env.PROFESSIONAL_JWT_SECRET || "fallback-secret-change-in-production",
        );

        const token = await new SignJWT({
          professionalId: professional.id,
          email: professional.email,
          type: professional.type,
        })
          .setProtectedHeader({ alg: "HS256", typ: "JWT" })
          .setIssuedAt()
          .setExpirationTime("7d")
          .sign(secret);

        return {
          token,
          professional: {
            id: professional.id,
            fullName: professional.fullName,
            email: professional.email,
            type: professional.type,
          },
        };
      }),
  }),
  insights: insightsRouter,
  students: studentsRouter,
  workouts: workoutsRouter,
  nutrition: nutritionRouter,
  dashboard: dashboardRouter,
  professionals: professionalsRouter,
});

export type AppRouter = typeof appRouter;