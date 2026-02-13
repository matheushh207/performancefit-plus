import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Apple, ChefHat, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { Student } from "./Students";
import { Workout } from "./Workouts"; // Importa a interface Workout
import { Diet } from "./Nutrition"; // Importa a interface Diet
import { Recipe, getRecipesByDiet } from "@/lib/googleDocs";

import { trpc } from "@/lib/trpc";

function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed || 1;

  for (let i = result.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 1664525 + 1013904223) >>> 0;
    const j = currentSeed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export default function StudentPortal() {
  const [, setLocation] = useLocation();
  const studentCPF = localStorage.getItem("studentCPF");

  // Redirect if no CPF
  useEffect(() => {
    if (!studentCPF) {
      setLocation("/student-access");
    }
  }, [studentCPF, setLocation]);

  const { data, isLoading: loading } = trpc.students.getData.useQuery(
    { cpf: studentCPF || "" },
    { enabled: !!studentCPF }
  );

  const student = data?.student;
  const studentWorkouts = data?.workouts || [];
  const studentDiets = data?.diets || [];

  const [dailyRecipes, setDailyRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (studentDiets.length > 0) {
        const activeDiet = studentDiets[studentDiets.length - 1]; // Assuming last is active/latest
        try {
          const recipesForDiet = await getRecipesByDiet(activeDiet.type);
          const today = new Date();
          const dayKey = today.toISOString().slice(0, 10); // YYYY-MM-DD
          const seed = hashStringToNumber(`${studentCPF}-${dayKey}`);
          const shuffled = shuffleWithSeed(recipesForDiet, seed);
          setDailyRecipes(shuffled.slice(0, 5));
        } catch (error) {
          console.error("Erro ao carregar receitas do aluno:", error);
          setDailyRecipes([]);
        }
      }
    };

    if (studentDiets.length > 0 && studentCPF) { // Ensure studentCPF is available for seed
      fetchRecipes();
    }
  }, [studentDiets, studentCPF]);

  const handleLogout = () => {
    localStorage.removeItem("studentCPF");
    setLocation("/student-access");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando seu portal...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Aluno não encontrado ou sessão expirada.</p>
          <Button onClick={() => setLocation("/student-access")}>Voltar para o Acesso</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Olá, {student.fullName.split(" ")[0]}!</h1>
            <p className="text-sm opacity-90">Seu portal PerformanceFit+</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-white/10 border-white/20 hover:bg-white/20"
          >
            <ArrowLeft size={18} />
            Sair
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Seção de Treinos */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Dumbbell size={24} /> Seu Treino</h2>
          {studentWorkouts.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Nenhum treino atribuído ainda.
            </Card>
          ) : (
            <div className="grid gap-4">
              {studentWorkouts.map((workout: any) => (
                <Card key={workout.id} className="p-6">
                  <h3 className="text-xl font-bold mb-2">{workout.name}</h3>
                  <p className="text-muted-foreground mb-3">{workout.type}</p>

                  {workout.notes && (
                    <div className="mt-4 bg-secondary/10 p-4 rounded-md">
                      <p className="text-sm font-semibold mb-2">Orientações:</p>
                      <p className="text-sm whitespace-pre-wrap">{workout.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-muted-foreground">
                    Criado em: {new Date(workout.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Dietas */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 mt-8"><Apple size={24} /> Sua Dieta</h2>
          {studentDiets.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Nenhum plano nutricional atribuído ainda.
            </Card>
          ) : (
            <div className="grid gap-4">
              {studentDiets.map((diet: any) => (
                <Card key={diet.id} className="p-6">
                  <h3 className="text-xl font-bold mb-2">{diet.name}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded capitalize">{diet.type}</span>
                  </div>

                  {diet.notes && <p className="text-sm text-muted-foreground mb-4 italic">{diet.notes}</p>}

                  {diet.meals && diet.meals.length > 0 ? (
                    <div className="grid gap-3">
                      {diet.meals.map((meal: any, mealIndex: number) => (
                        <div key={mealIndex} className="bg-secondary/10 p-3 rounded-md">
                          <h4 className="font-bold text-sm mb-1">{meal.name} {meal.time && `(${meal.time})`}</h4>
                          {meal.notes && <p className="text-xs text-muted-foreground">{meal.notes}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma refeição detalhada.</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Receitas */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 mt-8">
            <ChefHat size={24} /> Receitas Sugeridas
          </h2>
          {dailyRecipes.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Nenhuma receita disponível no momento.
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyRecipes.map((recipe, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-accent/10">
                  <div className="flex items-center justify-between mb-4">
                    <ChefHat size={32} className="text-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-1 rounded">
                      {recipe.tipo}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{recipe.nome}</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dieta:</span>
                      <span className="font-semibold">{recipe.dieta}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Calorias:</span>
                      <span className="font-semibold text-accent">{recipe.calorias} kcal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase">Prot</p>
                        <p className="font-bold">{recipe.proteina}g</p>
                      </div>
                      <div className="text-center border-x border-border">
                        <p className="text-[10px] text-muted-foreground uppercase">Carb</p>
                        <p className="font-bold">{recipe.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase">Gord</p>
                        <p className="font-bold">{recipe.gordura}g</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold uppercase">Ingredientes:</p>
                    <p className="text-sm line-clamp-2 italic">{recipe.ingredientes}</p>
                  </div>

                  <Button className="w-full mt-6 bg-accent text-accent-foreground hover:opacity-90">
                    Ver Detalhes
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Relatórios (Placeholder) */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 mt-8"><FileText size={24} /> Relatórios de Evolução</h2>
          <Card className="p-6 text-center text-muted-foreground">
            Funcionalidade de relatórios em desenvolvimento.
          </Card>
        </div>
      </div>
    </div>
  );
}

// A função ChefHat foi movida para o ProfessionalDashboard.tsx ou para um componente compartilhado para evitar conflitos.
// Se você ainda precisar dela aqui, certifique-se de que não há outra declaração em outro lugar.
// function ChefHat(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0 5.11 5.11 0 0 1 1.05 1.54 4 4 0 0 1 1.41 7.87" />
//       <path d="M6 14h12l-1.5 7H7.5Z" />
//     </svg>
//    );
// }
