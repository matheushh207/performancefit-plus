import { COOKIE_NAME } from "@shared/const";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, professionalProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { insights, students, workouts, diets, physicalEvaluations, professionals, meals, workoutExercises } from "../drizzle/schema";
import { and, eq, sql, inArray } from "drizzle-orm";

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

  get: professionalProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const [student] = await db
        .select()
        .from(students)
        .where(and(
          eq(students.id, input.id),
          eq(students.professionalId, ctx.professional.professionalId)
        ))
        .limit(1);

      if (!student) {
        throw new Error("Student not found or unauthorized");
      }

      // Fetch related data
      const studentWorkouts = await db
        .select()
        .from(workouts)
        .where(eq(workouts.studentId, student.id));

      const studentDiets = await db
        .select()
        .from(diets)
        .where(eq(diets.studentId, student.id));

      const evaluations = await db
        .select()
        .from(physicalEvaluations)
        .where(eq(physicalEvaluations.studentId, student.id))
        .orderBy(physicalEvaluations.evaluationDate);

      return {
        student,
        workouts: studentWorkouts,
        diets: studentDiets,
        evaluations
      };
    }),

  submitAccess: publicProcedure
    .input(z.object({ cpf: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.cpf, input.cpf))
        .limit(1);

      if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
      }

      return student;
    }),

  getData: publicProcedure
    .input(z.object({ cpf: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.cpf, input.cpf))
        .limit(1);

      if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
      }

      // Fetch related data
      const studentWorkouts = await db
        .select()
        .from(workouts)
        .where(eq(workouts.studentId, student.id));

      const studentDiets = await db
        .select()
        .from(diets)
        .where(eq(diets.studentId, student.id));

      let studentMeals: any[] = [];
      if (studentDiets.length > 0) {
        const dietIds = studentDiets.map(d => d.id);
        studentMeals = await db
          .select()
          .from(meals)
          .where(inArray(meals.dietId, dietIds));
      }

      // Combine diets with their meals and parse notes
      const dietsWithMeals = studentDiets.map(diet => {
        let dietDetails: any = {};
        try {
          if (diet.notes) {
            dietDetails = JSON.parse(diet.notes);
          }
        } catch (e) {
          console.error("Error parsing diet notes:", e);
        }

        const thisDietMeals = studentMeals.filter(m => m.dietId === diet.id);
        const parsedMeals = thisDietMeals.map(meal => {
          let foodItems: any[] = [];
          try {
            if (meal.notes) {
              foodItems = JSON.parse(meal.notes);
            }
          } catch (e) {
            console.error("Error parsing meal notes:", e);
          }
          return {
            ...meal,
            foodItems
          };
        });

        return {
          ...diet,
          description: dietDetails.description || "",
          totalCalories: dietDetails.totalCalories || "",
          totalProtein: dietDetails.totalProtein || "",
          totalCarbs: dietDetails.totalCarbs || "",
          totalFat: dietDetails.totalFat || "",
          meals: parsedMeals
        };
      });

      const parsedWorkouts = studentWorkouts.map(workout => {
        let details: any = {};
        try {
          if (workout.notes) {
            details = JSON.parse(workout.notes);
          }
        } catch (e) {
          console.error("Error parsing workout notes:", e);
        }
        return {
          ...workout,
          description: details.description || "",
          duration: details.duration || "",
          difficulty: details.difficulty || ""
        };
      });

      const studentEvaluations = await db
        .select()
        .from(physicalEvaluations)
        .where(eq(physicalEvaluations.studentId, student.id))
        .orderBy(sql`${physicalEvaluations.evaluationDate} DESC`);

      return {
        student,
        workouts: parsedWorkouts,
        diets: dietsWithMeals,
        evaluations: studentEvaluations
      };
    }),

  create: professionalProcedure
    .input(z.object({
      fullName: z.string(),
      email: z.string().email().optional().or(z.literal("")),
      cpf: z.string(),
      phone: z.string().optional(),
      objective: z.string().optional(),
      notes: z.string().optional()
    }))
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
            phone: input.phone || "",
            objective: input.objective || "",
            notes: input.notes || ""
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

  update: professionalProcedure
    .input(z.object({
      id: z.number(),
      fullName: z.string().optional(),
      email: z.string().email().optional().or(z.literal("")),
      phone: z.string().optional(),
      objective: z.string().optional(),
      notes: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      await db
        .update(students)
        .set({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          objective: input.objective,
          notes: input.notes,
          updatedAt: new Date()
        })
        .where(and(
          eq(students.id, input.id),
          eq(students.professionalId, ctx.professional.professionalId)
        ));

      return { success: true };
    }),

  delete: professionalProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      await db
        .delete(students)
        .where(and(
          eq(students.id, input.id),
          eq(students.professionalId, ctx.professional.professionalId)
        ));

      return { success: true };
    }),
});



const physicalEvaluationsRouter = router({
  list: professionalProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return [];
      // Fetch students for this professional first to avoid complex subqueries that might fail in some dialects
      const professionalStudents = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.professionalId, ctx.professional.professionalId));

      if (professionalStudents.length === 0) return [];

      const studentIds = professionalStudents.map(s => s.id);

      return await db
        .select()
        .from(physicalEvaluations)
        .where(inArray(physicalEvaluations.studentId, studentIds))
        .orderBy(sql`${physicalEvaluations.evaluationDate} DESC`);
    } catch (error) {
      console.error("❌ Erro ao listar avaliações:", error);
      return [];
    }
  }),

  create: professionalProcedure
    .input(z.object({
      studentId: z.number(),
      evaluationDate: z.string(), // ISO date string
      weight: z.string(),
      height: z.string(),
      bodyFatPercentage: z.string(),
      // Medidas
      cintura: z.string().optional(),
      abdomen: z.string().optional(),
      quadril: z.string().optional(),
      peitoral: z.string().optional(),
      bracoRelaxado: z.string().optional(),
      bracoContraido: z.string().optional(),
      coxa: z.string().optional(),
      panturrilha: z.string().optional(),
      // Saúde
      pressao: z.string().optional(),
      frequenciaCardiaca: z.string().optional(),
      lesoes: z.string().optional(),
      medicamentos: z.string().optional(),
      // Estratégico
      objetivo: z.string().optional(),
      observations: z.string().optional(),
      photoBeforeUrl: z.string().optional(),
      photoAfterUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      console.log("🚀 Tentando cadastrar AVALIAÇÃO COMPLETA:", input.studentId);
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      try {
        // Buscar dados do aluno para idade e gênero (usados na TMB)
        const [student] = await db
          .select()
          .from(students)
          .where(eq(students.id, input.studentId))
          .limit(1);

        const weight = parseFloat(input.weight);
        const height = parseFloat(input.height);
        const bf = parseFloat(input.bodyFatPercentage);

        // Cálculos Básicos
        const imc = (weight / ((height / 100) ** 2)).toFixed(2);
        const fatMass = (weight * (bf / 100)).toFixed(2);
        const leanMass = (weight - parseFloat(fatMass)).toFixed(2);

        // Cálculos de Saúde (TMB)
        let age = 30; // Default
        if (student?.birthDate) {
          const birth = new Date(student.birthDate);
          age = new Date().getFullYear() - birth.getFullYear();
        }

        let tmb = 0;
        if (student?.gender === "female") {
          tmb = 10 * weight + 6.25 * height - 5 * age - 161;
        } else {
          tmb = 10 * weight + 6.25 * height - 5 * age + 5;
        }

        // Medidas Extras
        const cintura = input.cintura ? parseFloat(input.cintura) : 0;
        const quadril = input.quadril ? parseFloat(input.quadril) : 0;
        const rcq = quadril > 0 ? (cintura / quadril).toFixed(2) : "0";

        const [result] = await db
          .insert(physicalEvaluations)
          .values({
            studentId: input.studentId,
            evaluationDate: new Date(input.evaluationDate),
            weight: input.weight,
            height: input.height,
            imc: imc,
            bodyFatPercentage: input.bodyFatPercentage,
            leanMass: leanMass,
            fatMass: fatMass,

            // Medidas Corporais
            cintura: input.cintura || null,
            abdomen: input.abdomen || null,
            quadril: input.quadril || null,
            peitoral: input.peitoral || null,
            bracoRelaxado: input.bracoRelaxado || null,
            bracoContraido: input.bracoContraido || null,
            coxa: input.coxa || null,
            panturrilha: input.panturrilha || null,

            // Saúde
            pressao: input.pressao || "",
            frequenciaCardiaca: input.frequenciaCardiaca ? parseInt(input.frequenciaCardiaca) : null,
            lesoes: input.lesoes || "",
            medicamentos: input.medicamentos || "",

            // Estratégico
            objetivo: input.objetivo || "",
            observations: input.observations || "",

            // Cálculos
            tmb: tmb.toFixed(2),
            gastoCalorico: (tmb * 1.2).toFixed(2), // Fator base
            relacaoCinturaQuadril: rcq,

            // Fotos
            photoBeforeUrl: input.photoBeforeUrl || null,
            photoAfterUrl: input.photoAfterUrl || null
          });

        console.log("✅ Avaliação cadastrada com sucesso! ID:", result.insertId);
        return { success: true, id: result.insertId };
      } catch (error: any) {
        console.error("❌ ERRO AO CADASTRAR AVALIAÇÃO:", error.message);
        throw new Error(`Erro no banco (Avaliação): ${error.message}`);
      }
    }),

  delete: professionalProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      await db.delete(physicalEvaluations).where(eq(physicalEvaluations.id, input.id));
      return { success: true };
    }),
});

const workoutsRouter = router({
  list: professionalProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return [];

      const professionalWorkouts = await db
        .select()
        .from(workouts)
        .where(eq(workouts.professionalId, ctx.professional.professionalId));

      if (professionalWorkouts.length === 0) return [];

      const workoutIds = professionalWorkouts.map(w => w.id);
      const exercises = await db
        .select()
        .from(workoutExercises)
        .where(inArray(workoutExercises.workoutId, workoutIds));

      return professionalWorkouts.map(workout => {
        let details: any = {};
        try {
          if (workout.notes) {
            details = JSON.parse(workout.notes);
          }
        } catch (e) {
          console.error("Error parsing workout notes:", e);
        }
        return {
          ...workout,
          description: details.description || "",
          duration: details.duration || "",
          difficulty: details.difficulty || "",
          exercises: exercises.filter(e => e.workoutId === workout.id)
        };
      });
    } catch (error) {
      console.error("Error listing workouts:", error);
      return [];
    }
  }),

  create: professionalProcedure
    .input(z.object({
      studentId: z.number(),
      name: z.string(),
      description: z.string().optional(),
      duration: z.string().optional(),
      difficulty: z.string().optional(),
      exercises: z.array(z.object({
        name: z.string(),
        sets: z.string(),
        reps: z.string(),
        equipment: z.string().optional()
      }))
    }))
    .mutation(async ({ input, ctx }) => {
      console.log("🚀 Tentando cadastrar TREINO COMPLETO:", input.name);
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      try {
        const [result] = await db
          .insert(workouts)
          .values({
            studentId: input.studentId,
            professionalId: ctx.professional.professionalId,
            name: input.name,
            type: "hypertrophy", // Defaulting, could be improved
            isActive: true,
            notes: JSON.stringify({
              description: input.description,
              duration: input.duration,
              difficulty: input.difficulty
            })
          });

        const workoutId = result.insertId;
        console.log("✅ Treino criado, ID:", workoutId);

        if (input.exercises && input.exercises.length > 0) {
          for (const ex of input.exercises) {
            await db.insert(workoutExercises).values({
              workoutId: workoutId,
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              equipment: ex.equipment || "",
              order: 0
            });
          }
        }

        return { success: true, id: workoutId };
      } catch (error: any) {
        console.error("❌ ERRO AO CADASTRAR TREINO:", error.message);
        throw new Error(`Erro no banco (Treino): ${error.message}`);
      }
    }),

  delete: professionalProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      await db.delete(workoutExercises).where(eq(workoutExercises.workoutId, input.id));
      await db.delete(workouts).where(and(
        eq(workouts.id, input.id),
        eq(workouts.professionalId, ctx.professional.professionalId)
      ));
      return { success: true };
    }),
});


const nutritionRouter = router({
  list: professionalProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return [];

      const professionalDiets = await db
        .select()
        .from(diets)
        .where(eq(diets.professionalId, ctx.professional.professionalId));

      if (professionalDiets.length === 0) return [];

      const dietIds = professionalDiets.map(d => d.id);
      const dietMeals = await db
        .select()
        .from(meals)
        .where(inArray(meals.dietId, dietIds));

      return professionalDiets.map(diet => {
        let dietDetails: any = {};
        try {
          if (diet.notes) {
            dietDetails = JSON.parse(diet.notes);
          }
        } catch (e) {
          console.error("Error parsing diet notes in list:", e);
        }

        const thisDietMeals = dietMeals.filter(m => m.dietId === diet.id);
        const parsedMeals = thisDietMeals.map(meal => {
          let foodItems: any[] = [];
          let mealDescription = "";
          try {
            if (meal.notes) {
              const parsed = JSON.parse(meal.notes);
              if (Array.isArray(parsed)) {
                foodItems = parsed;
              } else if (typeof parsed === "object" && parsed !== null) {
                // Se o notes for um objeto com descrição e foodItems
                foodItems = parsed.foodItems || [];
                mealDescription = parsed.description || "";
              }
            }
          } catch (e) {
            console.error("Error parsing meal notes:", e);
          }
          return {
            ...meal,
            description: mealDescription,
            foodItems
          };
        });

        return {
          ...diet,
          description: dietDetails.description || "",
          totalCalories: dietDetails.totalCalories || "0",
          totalProtein: dietDetails.totalProtein || "0",
          totalCarbs: dietDetails.totalCarbs || "0",
          totalFat: dietDetails.totalFat || "0",
          meals: parsedMeals
        };
      });
    } catch (error) {
      console.error("Error listing diets:", error);
      return [];
    }
  }),

  create: professionalProcedure
    .input(z.object({
      studentId: z.number(),
      name: z.string(),
      description: z.string().optional(),
      type: z.string().optional(),
      totalCalories: z.string().optional(),
      totalProtein: z.string().optional(),
      totalCarbs: z.string().optional(),
      totalFat: z.string().optional(),
      meals: z.array(z.object({
        name: z.string(),
        time: z.string().optional(),
        description: z.string().optional(),
        foodItems: z.array(z.any())
      }))
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      try {
        let dbType = "maintenance";
        if (input.type === "emagrecimento" || input.type === "weight_loss") dbType = "weight_loss";
        else if (input.type === "hipertrofia" || input.type === "hypertrophy") dbType = "hypertrophy";

        const [result] = await db
          .insert(diets)
          .values({
            studentId: input.studentId,
            professionalId: ctx.professional.professionalId,
            name: input.name,
            type: dbType as any,
            isActive: true,
            notes: JSON.stringify({
              description: input.description,
              totalCalories: input.totalCalories,
              totalProtein: input.totalProtein,
              totalCarbs: input.totalCarbs,
              totalFat: input.totalFat
            })
          });

        const dietId = result.insertId;

        if (input.meals && input.meals.length > 0) {
          for (const meal of input.meals) {
            await db.insert(meals).values({
              dietId: dietId,
              name: meal.name,
              time: meal.time || "",
              order: 0,
              notes: JSON.stringify(meal.foodItems)
            });
          }
        }

        return { success: true, id: dietId };
      } catch (error: any) {
        console.error("Error creating diet:", error);
        throw new Error(`Database error: ${error.message}`);
      }
    }),

  delete: professionalProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      await db.delete(meals).where(eq(meals.dietId, input.id));
      await db.delete(diets).where(and(
        eq(diets.id, input.id),
        eq(diets.professionalId, ctx.professional.professionalId)
      ));
      return { success: true };
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
  physicalEvaluations: physicalEvaluationsRouter,
  workouts: workoutsRouter,
  nutrition: nutritionRouter,
  dashboard: dashboardRouter,
  professionals: professionalsRouter,
});

export type AppRouter = typeof appRouter;