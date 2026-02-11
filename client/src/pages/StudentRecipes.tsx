import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat } from "lucide-react";
import { useLocation } from "wouter";

export default function StudentRecipes() {
  const [, setLocation] = useLocation();

  const recipes = [
    { id: 1, name: "Frango com Brócolis", calories: 310, protein: 45, time: "20 min", difficulty: "Fácil" },
    { id: 2, name: "Omelete Proteica", calories: 280, protein: 30, time: "10 min", difficulty: "Fácil" },
    { id: 3, name: "Salmão ao Forno", calories: 350, protein: 40, time: "25 min", difficulty: "Médio" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">👨‍🍳 Receitas</h1>
            <p className="text-sm opacity-90">Receitas compatíveis com sua dieta</p>
          </div>
          <Button
            onClick={() => setLocation("/student-portal")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="p-6 hover:border-accent transition-colors">
              <div className="flex items-center justify-between mb-4">
                <ChefHat size={32} className="text-accent" />
                <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded">{recipe.difficulty}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>⏱️ Tempo: {recipe.time}</p>
                <p>🔥 Calorias: {recipe.calories}</p>
                <p>💪 Proteína: {recipe.protein}g</p>
              </div>
              <Button className="w-full">Ver Receita</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}