import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, ArrowLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { Student } from "./Students"; // Importa a interface Student

export interface FoodItem {
  name: string;
  quantity: string;
  unit: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Meal {
  name: string;
  time: string;
  description: string;
  foodItems: FoodItem[];
}

export interface Diet {
  id: number;
  studentId: string; // CPF do aluno
  name: string;
  description: string;
  type: string;
  totalCalories: string;
  totalProtein: string;
  totalCarbs: string;
  totalFat: string;
  meals: Meal[]; // Array de refeições detalhadas
}

export default function Nutrition() {
  const [, setLocation] = useLocation();
  const [students, setStudents] = useState<Student[]>([]);
  const [diets, setDiets] = useState<Diet[]>(() => {
    const saved = localStorage.getItem("performancefit_diets");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Diet, 'id'>>({
    studentId: "",
    name: "",
    description: "",
    type: "balanceada",
    totalCalories: "0",
    totalProtein: "0",
    totalCarbs: "0",
    totalFat: "0",
    meals: [],
  });
  const [currentMeal, setCurrentMeal] = useState<Meal>({
    name: "",
    time: "",
    description: "",
    foodItems: [],
  });
  const [currentFoodItem, setCurrentFoodItem] = useState<FoodItem>({
    name: "",
    quantity: "",
    unit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  useEffect(() => {
    const savedStudents = localStorage.getItem("performancefit_students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("performancefit_diets", JSON.stringify(diets));
  }, [diets]);

  const calculateTotals = (meals: Meal[]) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(meal => {
      meal.foodItems.forEach(item => {
        totalCalories += parseFloat(item.calories || "0");
        totalProtein += parseFloat(item.protein || "0");
        totalCarbs += parseFloat(item.carbs || "0");
        totalFat += parseFloat(item.fat || "0");
      });
    });

    setFormData(prev => ({
      ...prev,
      totalCalories: totalCalories.toFixed(0),
      totalProtein: totalProtein.toFixed(0),
      totalCarbs: totalCarbs.toFixed(0),
      totalFat: totalFat.toFixed(0),
    }));
  };

  const handleAddFoodItem = () => {
    if (currentFoodItem.name && currentFoodItem.quantity) {
      setCurrentMeal(prev => ({
        ...prev,
        foodItems: [...prev.foodItems, currentFoodItem]
      }));
      setCurrentFoodItem({
        name: "",
        quantity: "",
        unit: "g",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
    }
  };

  const handleRemoveFoodItem = (index: number) => {
    setCurrentMeal(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter((_, i) => i !== index)
    }));
  };

  const handleAddMeal = () => {
    if (currentMeal.name && currentMeal.foodItems.length > 0) {
      setFormData(prev => ({
        ...prev,
        meals: [...prev.meals, currentMeal]
      }));
      setCurrentMeal({
        name: "",
        time: "",
        description: "",
        foodItems: [],
      });
      calculateTotals([...formData.meals, currentMeal]);
    } else {
      alert("Por favor, preencha o nome da refeição e adicione pelo menos um alimento.");
    }
  };

  const handleRemoveMeal = (index: number) => {
    const updatedMeals = formData.meals.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      meals: updatedMeals
    }));
    calculateTotals(updatedMeals);
  };

  const handleAddDiet = () => {
    if (formData.name && formData.studentId && formData.meals.length > 0) {
      setDiets([...diets, { id: Date.now(), ...formData }]);
      setFormData({
        studentId: "",
        name: "",
        description: "",
        type: "balanceada",
        totalCalories: "0",
        totalProtein: "0",
        totalCarbs: "0",
        totalFat: "0",
        meals: [],
      });
      setShowForm(false);
    } else {
      alert("Por favor, preencha o nome do plano, selecione um aluno e adicione pelo menos uma refeição.");
    }
  };

  const handleDeleteDiet = (id: number) => {
    setDiets(diets.filter((d) => d.id !== id));
  };

  const getStudentName = (cpf: string) => {
    const student = students.find(s => s.cpf === cpf);
    return student ? student.name : "Aluno não encontrado";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nutrição</h1>
            <p className="text-sm opacity-90">Crie planos nutricionais detalhados</p>
          </div>
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

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Planos Nutricionais</h2>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Plano
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Adicionar Novo Plano Nutricional</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-2 block">Selecionar Aluno</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Selecione um aluno...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name} (CPF: {student.cpf})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Nome do Plano</label>
                <Input
                  type="text"
                  placeholder="Plano Emagrecimento"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Tipo de Dieta</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="balanceada">Balanceada</option>
                  <option value="hiperproteica">Hiperproteica</option>
                  <option value="baixa-carbo">Baixa Carbo</option>
                  <option value="cetogenica">Cetogênica</option>
                  <option value="vegana">Vegana</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-2 block">Descrição do Plano</label>
                <textarea
                  placeholder="Plano focado em redução de gordura corporal..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  rows={4}
                />
              </div>
            </div>

            <h4 className="text-lg font-bold mb-3">Refeições</h4>
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-secondary/5">
              {formData.meals.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center">Nenhuma refeição adicionada ainda.</p>
              ) : (
                <div className="grid gap-4">
                  {formData.meals.map((meal, mealIndex) => (
                    <Card key={mealIndex} className="p-4 bg-background shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold">{meal.name} {meal.time && `(${meal.time})`}</h5>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveMeal(mealIndex)}>
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                      {meal.description && <p className="text-sm text-muted-foreground mb-2">{meal.description}</p>}
                      <p className="text-xs font-semibold mb-1">Alimentos:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {meal.foodItems.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            {item.quantity}{item.unit} de {item.name} ({item.calories}kcal, P:{item.protein}g, C:{item.carbs}g, G:{item.fat}g)
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 border rounded-lg bg-background">
                <h5 className="font-bold mb-3">Adicionar Nova Refeição</h5>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Nome da Refeição</label>
                    <Input
                      type="text"
                      placeholder="Café da Manhã"
                      value={currentMeal.name}
                      onChange={(e) => setCurrentMeal({ ...currentMeal, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Horário (opcional)</label>
                    <Input
                      type="text"
                      placeholder="08:00"
                      value={currentMeal.time}
                      onChange={(e) => setCurrentMeal({ ...currentMeal, time: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold mb-1 block">Descrição da Refeição (opcional)</label>
                    <textarea
                      placeholder="Ovos mexidos com pão integral..."
                      value={currentMeal.description}
                      onChange={(e) => setCurrentMeal({ ...currentMeal, description: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      rows={2}
                    />
                  </div>
                </div>

                <h6 className="font-semibold mb-2">Alimentos da Refeição</h6>
                <div className="space-y-2 mb-4">
                  {currentMeal.foodItems.length === 0 ? (
                    <p className="text-muted-foreground text-xs">Nenhum alimento nesta refeição ainda.</p>
                  ) : (
                    <div className="grid gap-2">
                      {currentMeal.foodItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between bg-secondary/10 p-2 rounded-md">
                          <p className="text-sm">{item.quantity}{item.unit} de {item.name}</p>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveFoodItem(itemIndex)}>
                            <X size={14} className="text-red-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Alimento</label>
                    <Input
                      type="text"
                      placeholder="Ovo"
                      value={currentFoodItem.name}
                      onChange={(e) => setCurrentFoodItem({ ...currentFoodItem, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Quantidade</label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={currentFoodItem.quantity}
                      onChange={(e) => setCurrentFoodItem({ ...currentFoodItem, quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Unidade</label>
                    <Input
                      type="text"
                      placeholder="unid, g, ml"
                      value={currentFoodItem.unit}
                      onChange={(e) => setCurrentFoodItem({ ...currentFoodItem, unit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Calorias</label>
                    <Input
                      type="number"
                      placeholder="150"
                      value={currentFoodItem.calories}
                      onChange={(e) => setCurrentFoodItem({ ...currentFoodItem, calories: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Proteína (g)</label>
                    <Input
                      type="number"
                      placeholder="12"
                      value={currentFoodItem.protein}
                      onChange={(e) => setCurrentFoodItem({ ...currentFoodItem, protein: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Carboidrato (g)</label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={currentFoodItem.carbs}
                      onChange={(e) => setCurrentFoodItem({ ...currentFoodItem, carbs: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Gordura (g)</label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={currentFoodItem.fat}
                      onChange={(e) => setCurrentFoodItem({ ...currentFoodItem, fat: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddFoodItem}
                  className="w-full bg-secondary text-secondary-foreground flex items-center gap-2 mt-3"
                >
                  <Plus size={18} />
                  Adicionar Alimento à Refeição
                </Button>
              </div>

              <Button
                onClick={handleAddMeal}
                className="w-full bg-accent text-accent-foreground flex items-center gap-2 mt-3"
              >
                <Plus size={18} />
                Adicionar Refeição ao Plano
              </Button>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleAddDiet}
                className="bg-accent text-accent-foreground"
              >
                Adicionar Plano Nutricional
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {diets.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não tem planos nutricionais cadastrados</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              Adicionar Primeiro Plano
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {diets.map((diet) => (
              <Card key={diet.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{diet.name}</h3>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                         {getStudentName(diet.studentId)}
                       </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{diet.description}</p>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm mb-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-muted-foreground">Calorias Totais</p>
                        <p className="font-semibold">{diet.totalCalories} kcal</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Proteína Total</p>
                        <p className="font-semibold">{diet.totalProtein}g</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Carboidrato Total</p>
                        <p className="font-semibold">{diet.totalCarbs}g</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gordura Total</p>
                        <p className="font-semibold">{diet.totalFat}g</p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold mb-2">Refeições:</p>
                    <div className="grid gap-3">
                      {diet.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="bg-secondary/10 p-3 rounded-md">
                          <h4 className="font-bold text-sm mb-1">{meal.name} {meal.time && `(${meal.time})`}</h4>
                          {meal.description && <p className="text-xs text-muted-foreground mb-2">{meal.description}</p>}
                          <ul className="list-disc list-inside text-xs text-muted-foreground">
                            {meal.foodItems.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item.quantity}{item.unit} de {item.name} ({item.calories}kcal, P:{item.protein}g, C:{item.carbs}g, G:{item.fat}g)
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDiet(diet.id)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
