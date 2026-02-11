import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function StudentWorkout() {
  const [, setLocation] = useLocation();
  const [selectedDay, setSelectedDay] = useState(1);

  const workoutData = {
    name: "Treino A - Peito e Tríceps",
    frequency: "3x por semana",
    days: [
      {
        day: 1,
        exercises: [
          { name: "Supino Reto", sets: 4, reps: 8, weight: 80, rest: 90 },
          { name: "Flexão de Tríceps", sets: 3, reps: 10, weight: 0, rest: 60 },
          { name: "Crucifixo", sets: 3, reps: 12, weight: 20, rest: 60 },
        ],
      },
      {
        day: 2,
        exercises: [
          { name: "Barra Fixa", sets: 4, reps: 8, weight: 0, rest: 90 },
          { name: "Rosca Direta", sets: 3, reps: 10, weight: 15, rest: 60 },
          { name: "Puxada na Máquina", sets: 3, reps: 12, weight: 50, rest: 60 },
        ],
      },
      {
        day: 3,
        exercises: [
          { name: "Leg Press", sets: 4, reps: 10, weight: 200, rest: 90 },
          { name: "Agachamento", sets: 3, reps: 8, weight: 100, rest: 90 },
          { name: "Extensora", sets: 3, reps: 12, weight: 60, rest: 60 },
        ],
      },
    ],
  };

  const currentDay = workoutData.days[selectedDay - 1];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💪 Seu Treino</h1>
            <p className="text-sm opacity-90">{workoutData.name}</p>
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
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Informações do Treino</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Nome</p>
              <p className="font-bold">{workoutData.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Frequência</p>
              <p className="font-bold">{workoutData.frequency}</p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Selecione o Dia</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {workoutData.days.map((day) => (
              <Button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`${
                  selectedDay === day.day
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border"
                }`}
              >
                Dia {day.day}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Exercícios - Dia {selectedDay}</h2>
          <div className="space-y-4">
            {currentDay.exercises.map((exercise, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4">{exercise.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm">Séries</p>
                        <p className="text-2xl font-bold text-accent">{exercise.sets}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Repetições</p>
                        <p className="text-2xl font-bold text-accent">{exercise.reps}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Peso (kg)</p>
                        <p className="text-2xl font-bold text-accent">
                          {exercise.weight > 0 ? exercise.weight : "Corporal"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Descanso (s)</p>
                        <p className="text-2xl font-bold text-accent">{exercise.rest}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Dumbbell size={40} className="text-accent opacity-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="font-bold mb-2">💡 Dica</h3>
          <p className="text-muted-foreground">
            Realize este treino 3x por semana. Deixe pelo menos um dia de descanso entre os treinos.
          </p>
        </Card>
      </div>
    </div>
  );
}