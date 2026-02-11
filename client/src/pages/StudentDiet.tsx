import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Apple } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function StudentDiet() {
  const [, setLocation] = useLocation();
  const [selectedMeal, setSelectedMeal] = useState("breakfast");

  const dietData = {
    name: "Dieta Hipertrofia 2500 cal",
    totalCalories: 2500,
    protein: 200,
    carbs: 250,
    fat: 80,
    meals: {
      breakfast: {
        time: "07:00",
        name: "Café da Manhã",
        foods: [
          { name: "Omelete de 3 ovos", calories: 300, protein: 25, carbs: 5, fat: 20 },
          { name: "Pão Integral", calories: 100, protein: 5, carbs: 20, fat: 2 },
        ],
      },
      snack1: {
        time: "10:00",
        name: "Lanche 1",
        foods: [
          { name: "Banana com Amendoim", calories: 200, protein: 10, carbs: 25, fat: 8 },
        ],
      },
      lunch: {
        time: "12:00",
        name: "Almoço",
        foods: [
          { name: "Frango Peito (150g)", calories: 250, protein: 50, carbs: 0, fat: 5 },
          { name: "Arroz Integral (100g)", calories: 111, protein: 3, carbs: 23, fat: 1 },
          { name: "Brócolis", calories: 34, protein: 3, carbs: 7, fat: 0 },
        ],
      },
      snack2: {
        time: "15:00",
        name: "Lanche 2",
        foods: [
          { name: "Whey Protein", calories: 120, protein: 25, carbs: 2, fat: 1 },
        ],
      },
      dinner: {
        time: "19:00",
        name: "Jantar",
        foods: [
          { name: "Salmão (120g)", calories: 250, protein: 24, carbs: 0, fat: 16 },
          { name: "Batata Doce (100g)", calories: 86, protein: 2, carbs: 20, fat: 0 },
          { name: "Salada Verde", calories: 30, protein: 2, carbs: 5, fat: 0 },
        ],
      },
    },
  };

  const mealKeys = Object.keys(dietData.meals) as Array<keyof typeof dietData.meals>;
  const currentMeal = dietData.meals[selectedMeal as keyof typeof dietData.meals];
  const mealFoods = currentMeal.foods;

  const totalMealCalories = mealFoods.reduce((sum, food) => sum + food.calories, 0);
  const totalMealProtein = mealFoods.reduce((sum, food) => sum + food.protein, 0);
  const totalMealCarbs = mealFoods.reduce((sum, food) => sum + food.carbs, 0);
  const totalMealFat = mealFoods.reduce((sum, food) => sum + food.fat, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🥗 Sua Dieta</h1>
            <p className="text-sm opacity-90">{dietData.name}</p>
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

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Calorias</p>
            <p className="text-3xl font-bold text-accent">{dietData.totalCalories}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Proteína (g)</p>
            <p className="text-3xl font-bold text-accent">{dietData.protein}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Carboidratos (g)</p>
            <p className="text-3xl font-bold text-accent">{dietData.carbs}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Gordura (g)</p>
            <p className="text-3xl font-bold text-accent">{dietData.fat}</p>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Selecione a Refeição</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {mealKeys.map((key) => (
              <Button
                key={key}
                onClick={() => setSelectedMeal(key)}
                className={`text-sm ${
                  selectedMeal === key
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border"
                }`}
              >
                {dietData.meals[key].time}
              </Button>
            ))}
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{currentMeal.name} ({currentMeal.time})</h2>
          <div className="space-y-4">
            {mealFoods.map((food, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                <div className="flex-1">
                  <p className="font-semibold">{food.name}</p>
                  <div className="grid grid-cols-4 gap-2 mt-2 text-sm text-muted-foreground">
                    <span>{food.calories} cal</span>
                    <span>{food.protein}g proteína</span>
                    <span>{food.carbs}g carbs</span>
                    <span>{food.fat}g gordura</span>
                  </div>
                </div>
                <Apple size={24} className="text-accent opacity-20 ml-4" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <p className="font-bold mb-2">Total da Refeição:</p>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Calorias</p>
                <p className="text-xl font-bold text-accent">{totalMealCalories}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Proteína</p>
                <p className="text-xl font-bold text-accent">{totalMealProtein}g</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Carboidratos</p>
                <p className="text-xl font-bold text-accent">{totalMealCarbs}g</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Gordura</p>
                <p className="text-xl font-bold text-accent">{totalMealFat}g</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}