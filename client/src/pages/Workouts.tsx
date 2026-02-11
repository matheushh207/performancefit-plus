import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, ArrowLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { Student } from "./Students"; // Importa a interface Student

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  equipment: string;
}

export interface Workout {
  id: number;
  studentId: string; // CPF do aluno
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  exercises: Exercise[]; // Array de exercícios detalhados
}

export default function Workouts() {
  const [, setLocation] = useLocation();
  const [students, setStudents] = useState<Student[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem("performancefit_workouts");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Workout, 'id'>>({
    studentId: "",
    name: "",
    description: "",
    duration: "",
    difficulty: "intermediario",
    exercises: [],
  });
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: "",
    sets: "",
    reps: "",
    equipment: "",
  });

  useEffect(() => {
    const savedStudents = localStorage.getItem("performancefit_students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("performancefit_workouts", JSON.stringify(workouts));
  }, [workouts]);

  const handleAddExercise = () => {
    if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, currentExercise]
      }));
      setCurrentExercise({
        name: "",
        sets: "",
        reps: "",
        equipment: "",
      });
    }
  };

  const handleRemoveExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleAddWorkout = () => {
    if (formData.name && formData.studentId && formData.exercises.length > 0) {
      setWorkouts([...workouts, { id: Date.now(), ...formData }]);
      setFormData({
        studentId: "",
        name: "",
        description: "",
        duration: "",
        difficulty: "intermediario",
        exercises: [],
      });
      setShowForm(false);
    } else {
      alert("Por favor, preencha o nome do treino, selecione um aluno e adicione pelo menos um exercício.");
    }
  };

  const handleDeleteWorkout = (id: number) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
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
            <h1 className="text-3xl font-bold">Treinos</h1>
            <p className="text-sm opacity-90">Crie e gerencie programas de treino detalhados</p>
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
            <h2 className="text-2xl font-bold">Lista de Treinos</h2>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Treino
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Adicionar Novo Treino</h3>
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
                <label className="text-sm font-semibold mb-2 block">Nome do Treino</label>
                <Input
                  type="text"
                  placeholder="Treino de Perna A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Duração (minutos)</label>
                <Input
                  type="number"
                  placeholder="60"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Dificuldade</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="facil">Fácil</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-2 block">Descrição do Treino</label>
                <textarea
                  placeholder="Foco em hipertrofia, 3x por semana..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  rows={4}
                />
              </div>
            </div>

            <h4 className="text-lg font-bold mb-3">Exercícios</h4>
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-secondary/5">
              {formData.exercises.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center">Nenhum exercício adicionado ainda.</p>
              ) : (
                <div className="grid gap-2">
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between bg-background p-3 rounded-md shadow-sm">
                      <div>
                        <p className="font-semibold">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">{exercise.sets} séries de {exercise.reps} repetições ({exercise.equipment})</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveExercise(index)}>
                        <X size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-4 gap-3 mt-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Nome do Exercício</label>
                  <Input
                    type="text"
                    placeholder="Supino Reto"
                    value={currentExercise.name}
                    onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Séries</label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={currentExercise.sets}
                    onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Repetições</label>
                  <Input
                    type="text"
                    placeholder="8-12"
                    value={currentExercise.reps}
                    onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Aparelho/Carga</label>
                  <Input
                    type="text"
                    placeholder="Barra, Halteres, Máquina"
                    value={currentExercise.equipment}
                    onChange={(e) => setCurrentExercise({ ...currentExercise, equipment: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={handleAddExercise}
                className="w-full bg-secondary text-secondary-foreground flex items-center gap-2 mt-3"
              >
                <Plus size={18} />
                Adicionar Exercício
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddWorkout}
                className="bg-accent text-accent-foreground"
              >
                Adicionar Treino
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

        {workouts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não tem treinos cadastrados</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              Adicionar Primeiro Treino
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <h3 className="text-xl font-bold">{workout.name}</h3>
                       <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                         {getStudentName(workout.studentId)}
                       </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{workout.description}</p>
                    <div className="grid gap-2 mt-4">
                      <p className="text-sm font-semibold">Exercícios:</p>
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="text-sm bg-secondary/10 p-2 rounded-md">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-muted-foreground">{exercise.sets} séries de {exercise.reps} repetições ({exercise.equipment})</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-muted-foreground">Duração</p>
                        <p className="font-semibold">{workout.duration} min</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dificuldade</p>
                        <p className="font-semibold capitalize">{workout.difficulty}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWorkout(workout.id)}
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
