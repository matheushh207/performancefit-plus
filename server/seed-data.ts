import bcrypt from "bcryptjs";
import { getDb } from "./db";
import {
  professionals,
  students,
  foods,
  recipes,
  recipeIngredients,
  physicalEvaluations,
  insights,
} from "../drizzle/schema";

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    const db = await getDb();
    if (!db) throw new Error("Falha ao conectar ao banco de dados");

    // ============ CRIAR PROFISSIONAL ============
    const passwordHash = await bcrypt.hash("123456", 10);
    const professionalResult = await db.insert(professionals).values({
      userId: "prof-carlos-123",
      fullName: "Carlos Silva",
      email: "carlos@performancefit.com",
      cpf: "123.456.789-00",
      phone: "(11) 99999-9999",
      type: "personal_trainer",
      specialization: "Ganho de Massa e Definição",
      licenseNumber: "CREF-123456",
      isActive: true,
      passwordHash,
    });

    const professionalId = (professionalResult as any).insertId;
    console.log(`✅ Profissional criado: ID ${professionalId}`);

    // ============ CRIAR ALUNOS ============
    const studentIds: number[] = [];
    const studentData = [
      {
        fullName: "João Santos",
        cpf: "111.111.111-11",
        email: "joao@email.com",
        phone: "(11) 98888-8888",
        objective: "Ganho de Massa",
      },
      {
        fullName: "Maria Oliveira",
        cpf: "222.222.222-22",
        email: "maria@email.com",
        phone: "(11) 97777-7777",
        objective: "Perda de Peso",
      },
      {
        fullName: "Pedro Costa",
        cpf: "333.333.333-33",
        email: "pedro@email.com",
        phone: "(11) 96666-6666",
        objective: "Definição",
      },
    ];

    for (const student of studentData) {
      const result = await db.insert(students).values({
        professionalId,
        fullName: student.fullName,
        cpf: student.cpf,
        email: student.email,
        phone: student.phone,
        objective: student.objective,
        isActive: true,
      });
      studentIds.push((result as any).insertId);
      console.log(`✅ Aluno criado: ${student.fullName}`);
    }

    // ============ CRIAR ALIMENTOS ============
    const foodIds: number[] = [];
    const foodData = [
      { name: "Frango Peito", calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: 100, unit: "g" },
      { name: "Arroz Integral", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, portion: 100, unit: "g" },
      { name: "Brócolis", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, portion: 100, unit: "g" },
      { name: "Batata Doce", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, portion: 100, unit: "g" },
      { name: "Ovo Inteiro", calories: 155, protein: 13, carbs: 1.1, fat: 11, portion: 1, unit: "un" },
      { name: "Aveia", calories: 389, protein: 17, carbs: 66, fat: 6.9, portion: 100, unit: "g" },
      { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, portion: 1, unit: "un" },
      { name: "Salmão", calories: 208, protein: 20, carbs: 0, fat: 13, portion: 100, unit: "g" },
      { name: "Cenoura", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, portion: 100, unit: "g" },
      { name: "Feijão", calories: 127, protein: 8.7, carbs: 23, fat: 0.5, portion: 100, unit: "g" },
      { name: "Pão Integral", calories: 265, protein: 9, carbs: 49, fat: 3.3, portion: 100, unit: "g" },
      { name: "Leite Desnatado", calories: 35, protein: 3.6, carbs: 5, fat: 0.1, portion: 100, unit: "ml" },
      { name: "Iogurte Natural", calories: 59, protein: 10, carbs: 3.3, fat: 0.4, portion: 100, unit: "g" },
      { name: "Maçã", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, portion: 1, unit: "un" },
      { name: "Abacate", calories: 160, protein: 2, carbs: 9, fat: 15, portion: 100, unit: "g" },
      { name: "Carne Moída", calories: 250, protein: 25, carbs: 0, fat: 16, portion: 100, unit: "g" },
      { name: "Azeite", calories: 884, protein: 0, carbs: 0, fat: 100, portion: 10, unit: "ml" },
      { name: "Mel", calories: 304, protein: 0.3, carbs: 82, fat: 0, portion: 20, unit: "g" },
      { name: "Amendoim", calories: 567, protein: 26, carbs: 16, fat: 49, portion: 100, unit: "g" },
    ];

    for (const food of foodData) {
      const result = await db.insert(foods).values({
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbohydrates: food.carbs,
        fat: food.fat,
        portion: food.portion,
        portionUnit: food.unit,
        source: "USDA",
        isCustom: false,
      });
      foodIds.push((result as any).insertId);
    }
    console.log(`✅ ${foodData.length} alimentos criados`);

    // ============ CRIAR RECEITAS ============
    const recipeData = [
      // CAFÉ DA MANHÃ
      {
        name: "Omelete com Claras e Legumes",
        dietType: "maintenance",
        calories: 220,
        protein: 28,
        carbs: 5,
        fat: 8,
        prepTime: 10,
        ingredients: [
          { foodId: foodIds[4], quantity: 3 }, // Ovo
          { foodId: foodIds[2], quantity: 100 }, // Brócolis
        ],
      },
      {
        name: "Aveia com Banana e Mel",
        dietType: "hypertrophy",
        calories: 380,
        protein: 12,
        carbs: 68,
        fat: 8,
        prepTime: 5,
        ingredients: [
          { foodId: foodIds[5], quantity: 50 }, // Aveia
          { foodId: foodIds[6], quantity: 1 }, // Banana
          { foodId: foodIds[17], quantity: 20 }, // Mel
        ],
      },
      {
        name: "Pão Integral com Queijo e Tomate",
        dietType: "maintenance",
        calories: 320,
        protein: 15,
        carbs: 45,
        fat: 10,
        prepTime: 5,
        ingredients: [
          { foodId: foodIds[10], quantity: 100 }, // Pão Integral
        ],
      },
      {
        name: "Iogurte com Granola e Frutas",
        dietType: "weight_loss",
        calories: 280,
        protein: 18,
        carbs: 38,
        fat: 6,
        prepTime: 2,
        ingredients: [
          { foodId: foodIds[12], quantity: 200 }, // Iogurte
          { foodId: foodIds[6], quantity: 1 }, // Banana
        ],
      },

      // LANCHE MANHÃ
      {
        name: "Maçã com Pasta de Amendoim",
        dietType: "maintenance",
        calories: 280,
        protein: 10,
        carbs: 28,
        fat: 15,
        prepTime: 2,
        ingredients: [
          { foodId: foodIds[13], quantity: 1 }, // Maçã
          { foodId: foodIds[18], quantity: 30 }, // Amendoim
        ],
      },
      {
        name: "Banana com Aveia",
        dietType: "weight_loss",
        calories: 200,
        protein: 8,
        carbs: 38,
        fat: 3,
        prepTime: 3,
        ingredients: [
          { foodId: foodIds[6], quantity: 1 }, // Banana
          { foodId: foodIds[5], quantity: 30 }, // Aveia
        ],
      },

      // ALMOÇO
      {
        name: "Frango Grelhado com Arroz e Brócolis",
        dietType: "hypertrophy",
        calories: 520,
        protein: 45,
        carbs: 52,
        fat: 8,
        prepTime: 30,
        ingredients: [
          { foodId: foodIds[0], quantity: 200 }, // Frango
          { foodId: foodIds[1], quantity: 150 }, // Arroz
          { foodId: foodIds[2], quantity: 150 }, // Brócolis
        ],
      },
      {
        name: "Salmão com Batata Doce e Cenoura",
        dietType: "maintenance",
        calories: 580,
        protein: 42,
        carbs: 48,
        fat: 22,
        prepTime: 35,
        ingredients: [
          { foodId: foodIds[7], quantity: 180 }, // Salmão
          { foodId: foodIds[3], quantity: 150 }, // Batata Doce
          { foodId: foodIds[8], quantity: 100 }, // Cenoura
        ],
      },
      {
        name: "Carne Moída com Feijão e Arroz",
        dietType: "hypertrophy",
        calories: 620,
        protein: 48,
        carbs: 58,
        fat: 18,
        prepTime: 40,
        ingredients: [
          { foodId: foodIds[15], quantity: 150 }, // Carne Moída
          { foodId: foodIds[9], quantity: 100 }, // Feijão
          { foodId: foodIds[1], quantity: 150 }, // Arroz
        ],
      },

      // PRÉ-TREINO
      {
        name: "Banana com Mel",
        dietType: "maintenance",
        calories: 200,
        protein: 2,
        carbs: 50,
        fat: 1,
        prepTime: 2,
        ingredients: [
          { foodId: foodIds[6], quantity: 1 }, // Banana
          { foodId: foodIds[17], quantity: 20 }, // Mel
        ],
      },
      {
        name: "Pão com Pasta de Amendoim",
        dietType: "hypertrophy",
        calories: 350,
        protein: 14,
        carbs: 42,
        fat: 16,
        prepTime: 3,
        ingredients: [
          { foodId: foodIds[10], quantity: 100 }, // Pão
          { foodId: foodIds[18], quantity: 30 }, // Amendoim
        ],
      },

      // JANTA
      {
        name: "Frango com Salada Verde",
        dietType: "weight_loss",
        calories: 350,
        protein: 42,
        carbs: 12,
        fat: 12,
        prepTime: 25,
        ingredients: [
          { foodId: foodIds[0], quantity: 200 }, // Frango
          { foodId: foodIds[2], quantity: 100 }, // Brócolis
        ],
      },
      {
        name: "Peixe com Legumes",
        dietType: "maintenance",
        calories: 380,
        protein: 40,
        carbs: 18,
        fat: 14,
        prepTime: 30,
        ingredients: [
          { foodId: foodIds[7], quantity: 150 }, // Salmão
          { foodId: foodIds[8], quantity: 100 }, // Cenoura
        ],
      },

      // SOBREMESAS
      {
        name: "Mousse de Chocolate com Aveia",
        dietType: "maintenance",
        calories: 180,
        protein: 8,
        carbs: 24,
        fat: 6,
        prepTime: 10,
        ingredients: [
          { foodId: foodIds[5], quantity: 30 }, // Aveia
          { foodId: foodIds[14], quantity: 50 }, // Abacate
        ],
      },
      {
        name: "Banana com Mel e Canela",
        dietType: "weight_loss",
        calories: 150,
        protein: 1,
        carbs: 38,
        fat: 1,
        prepTime: 3,
        ingredients: [
          { foodId: foodIds[6], quantity: 1 }, // Banana
          { foodId: foodIds[17], quantity: 20 }, // Mel
        ],
      },
    ];

    const recipeIds: number[] = [];
    for (const recipe of recipeData) {
      const result = await db.insert(recipes).values({
        name: recipe.name,
        description: `Receita de ${recipe.name}`,
        dietType: recipe.dietType,
        servings: 1,
        prepTime: recipe.prepTime,
        cookTime: 0,
        instructions: "Preparar conforme as instruções",
        totalCalories: recipe.calories,
        totalProtein: recipe.protein,
        totalCarbs: recipe.carbs,
        totalFat: recipe.fat,
        totalFiber: 0,
      });
      const recipeId = (result as any).insertId;
      recipeIds.push(recipeId);

      // Adicionar ingredientes
      for (const ingredient of recipe.ingredients) {
        await db.insert(recipeIngredients).values({
          recipeId,
          foodId: ingredient.foodId,
          quantity: ingredient.quantity,
          unit: "g",
        });
      }
    }
    console.log(`✅ ${recipeData.length} receitas criadas`);

    // ============ CRIAR AVALIAÇÕES ============
    for (let i = 0; i < studentIds.length; i++) {
      await db.insert(physicalEvaluations).values({
        studentId: studentIds[i],
        evaluationDate: new Date(),
        weight: 75 + i * 5,
        height: 1.75,
        imc: 24.5 + i,
        bodyFatPercentage: 15 + i * 3,
        leanMass: 65 + i * 4,
        fatMass: 10 + i * 2,
        observations: `Avaliação inicial - ${["Ganho de Massa", "Perda de Peso", "Definição"][i]}`,
      });
    }
    console.log(`✅ ${studentIds.length} avaliações criadas`);

    // ============ CRIAR INSIGHTS ============
    const insightData = [
      {
        studentId: studentIds[0],
        title: "Aumentar Intensidade",
        description: "Seu progresso está excelente! Considere aumentar a intensidade dos treinos em 20%.",
        type: "suggestion",
      },
      {
        studentId: studentIds[1],
        title: "Aumentar Ingestão de Proteína",
        description: "Você está abaixo da meta de proteína diária. Tente adicionar mais proteína às refeições.",
        type: "suggestion",
      },
      {
        studentId: studentIds[2],
        title: "Manter Consistência",
        description: "Você está indo bem! Mantenha a consistência nos treinos e na dieta.",
        type: "suggestion",
      },
    ];

    for (const insight of insightData) {
      await db.insert(insights).values({
        studentId: insight.studentId,
        professionalId,
        title: insight.title,
        description: insight.description,
        type: insight.type,
        severity: "medium",
        isResolved: false,
      });
    }
    console.log(`✅ ${insightData.length} insights criados`);

    console.log("\n✅ 🌱 Seed concluído com sucesso!");
    console.log("📊 Resumo:");
    console.log(`   - 1 profissional criado`);
    console.log(`   - ${studentIds.length} alunos criados`);
    console.log(`   - ${foodData.length} alimentos criados`);
    console.log(`   - ${recipeData.length} receitas criadas`);
    console.log(`   - ${studentIds.length} avaliações criadas`);
    console.log(`   - ${insightData.length} insights criados`);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

// Seed desabilitado - sistema pronto para produção sem dados fictícios
// Para executar manualmente, descomente a linha abaixo:
// seedDatabase();