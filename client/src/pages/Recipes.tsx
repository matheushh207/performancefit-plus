import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, ChefHat } from "lucide-react";
import { useLocation } from "wouter";
import { getAllRecipes, Recipe } from "@/lib/googleDocs"; // Importação corrigida

export default function Recipes() {
  const [, setLocation] = useLocation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    const data = await getAllRecipes();
    setRecipes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const recipesByMeal = recipes.reduce((acc, recipe) => {
    const meal = recipe.tipo || "Outros";
    if (!acc[meal]) {
      acc[meal] = [];
    }
    acc[meal].push(recipe);
    return acc;
  }, {} as Record<string, Recipe[]>);

  const mealOrder = ["Café da Manhã", "Almoço", "Lanche", "Jantar", "Ceia", "Pré-Treino", "Pós-Treino"];
  const sortedMeals = Object.keys(recipesByMeal).sort((a, b) => {
    const indexA = mealOrder.indexOf(a);
    const indexB = mealOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Banco de Receitas</h1>
            <p className="text-sm opacity-90">Sincronizado via Google Docs (Apps Script)</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchRecipes}
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 border-white/20 hover:bg-white/20"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Sincronizar
            </Button>
            <Button
              onClick={() => setLocation("/professional/dashboard")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Receitas Disponíveis</h2>
            <p className="text-sm text-muted-foreground">Total: {recipes.length} receitas encontradas</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw size={48} className="animate-spin text-accent" />
            <p className="text-muted-foreground">Buscando receitas no Google Docs...</p>
          </div>
        ) : recipes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhuma receita encontrada no Google Docs.</p>
            <Button
              onClick={fetchRecipes}
              className="bg-accent text-accent-foreground"
            >
              Tentar Novamente
            </Button>
          </Card>
        ) : (
          <div className="space-y-12">
            {sortedMeals.map((mealType) => (
              <div key={mealType}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ChefHat size={24} className="text-accent" />
                  {mealType}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipesByMeal[mealType].map((recipe, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-accent/10">
                      <div className="flex items-center justify-between mb-4">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
