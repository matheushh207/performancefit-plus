import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Dumbbell, Apple, Zap, LogOut, Plus, ChevronRight, ChefHat } from "lucide-react";
import { useLocation } from "wouter";
import { Student } from "./Students";
import { Workout } from "./Workouts";
import { Diet } from "./Nutrition";
import { trpc } from "@/lib/trpc";

export default function ProfessionalDashboard() {
  const [, setLocation] = useLocation();
  const { data: students = [] } = trpc.students.list.useQuery();
  const { data: workouts = [] } = trpc.workouts.list.useQuery();
  const { data: diets = [] } = trpc.nutrition.list.useQuery();
  const { data: stats } = trpc.dashboard.getStats.useQuery();

  useEffect(() => {
    const token =
      localStorage.getItem("professionalJwt") ??
      localStorage.getItem("professionalToken");
    if (!token) {
      setLocation("/professional/login");
      return;
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("professionalJwt");
    localStorage.removeItem("professionalToken");
    localStorage.removeItem("professionalInfo");
    setLocation("/professional/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Profissional</h1>
            <p className="text-sm opacity-90">Bem-vindo de volta!</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-white/10 border-white/20 hover:bg-white/20"
          >
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Cards de Estatísticas */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="p-6 flex items-center gap-4">
            <Users size={36} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Total de Alunos</p>
              <h2 className="text-2xl font-bold">{students.length}</h2>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <Dumbbell size={36} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Treinos Criados</p>
              <h2 className="text-2xl font-bold">{workouts.length}</h2>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <Apple size={36} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Dietas Elaboradas</p>
              <h2 className="text-2xl font-bold">{diets.length}</h2>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <Zap size={36} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Avaliações Realizadas</p>
              <h2 className="text-2xl font-bold">{stats?.insightCount ?? 0}</h2>{/* Using insightCount as proxy for alerts/evaluations for now, or just 0 if not tracked */}
            </div>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={() => setLocation("/students")}
              className="h-auto p-6 flex flex-col items-start gap-2 bg-card text-card-foreground hover:bg-card/90 border border-border"
            >
              <Users size={24} />
              <span className="text-lg font-semibold">Gerenciar Alunos</span>
              <span className="text-sm text-muted-foreground text-left">Adicione, edite ou remova alunos.</span>
            </Button>
            <Button
              onClick={() => setLocation("/workouts")}
              className="h-auto p-6 flex flex-col items-start gap-2 bg-card text-card-foreground hover:bg-card/90 border border-border"
            >
              <Dumbbell size={24} />
              <span className="text-lg font-semibold">Criar Treinos</span>
              <span className="text-sm text-muted-foreground text-left">Elabore treinos personalizados para seus alunos.</span>
            </Button>
            <Button
              onClick={() => setLocation("/nutrition")}
              className="h-auto p-6 flex flex-col items-start gap-2 bg-card text-card-foreground hover:bg-card/90 border border-border"
            >
              <Apple size={24} />
              <span className="text-lg font-semibold">Montar Dietas</span>
              <span className="text-sm text-muted-foreground text-left">Crie planos nutricionais detalhados.</span>
            </Button>
            <Button
              onClick={() => setLocation("/recipes")}
              className="h-auto p-6 flex flex-col items-start gap-2 bg-card text-card-foreground hover:bg-card/90 border border-border"
            >
              <ChefHat size={24} />
              <span className="text-lg font-semibold">Banco de Receitas</span>
              <span className="text-sm text-muted-foreground text-left">Consulte e utilize receitas do Google Docs.</span>
            </Button>
            <Button
              onClick={() => setLocation("/evaluations")}
              className="h-auto p-6 flex flex-col items-start gap-2 bg-card text-card-foreground hover:bg-card/90 border border-border"
            >
              <Zap size={24} />
              <span className="text-lg font-semibold">Avaliações Físicas</span>
              <span className="text-sm text-muted-foreground text-left">Registre e acompanhe o progresso dos alunos.</span>
            </Button>
          </div>
        </div>

        {/* Alunos Recentes (Placeholder) */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Alunos Recentes</h2>
          {students.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Nenhum aluno cadastrado ainda.
            </Card>
          ) : (
            <div className="grid gap-4">
              {students.slice(0, 3).map((student) => (
                <Card key={student.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{student.fullName}</p>
                    <p className="text-sm text-muted-foreground">CPF: {student.cpf}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setLocation(`/student/${student.id}`)}>
                    Ver Perfil <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
