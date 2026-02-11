import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Dumbbell, Apple, AlertCircle, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao PerformaceFit+. Sua plataforma de gestão profissional</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Alunos Ativos", value: "24", color: "from-blue-500 to-blue-600" },
            { icon: TrendingUp, label: "Avaliações", value: "18", color: "from-green-500 to-green-600" },
            { icon: Dumbbell, label: "Treinos", value: "42", color: "from-orange-500 to-orange-600" },
            { icon: Apple, label: "Dietas", value: "31", color: "from-red-500 to-red-600" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-bold mb-4">Atividades Recentes</h2>
            <div className="space-y-4">
              {[
                { name: "João Silva", action: "Avaliação Física", time: "Há 2 horas" },
                { name: "Maria Santos", action: "Novo Treino", time: "Há 4 horas" },
                { name: "Pedro Costa", action: "Dieta Atualizada", time: "Há 1 dia" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-semibold">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Alertas Importantes</h2>
            <div className="space-y-3">
              {[
                { icon: AlertCircle, text: "Aluno estagnado", severity: "warning" },
                { icon: AlertCircle, text: "Déficit calórico agressivo", severity: "danger" },
              ].map((alert, idx) => {
                const Icon = alert.icon;
                return (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${alert.severity === "warning" ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                    <Icon size={18} className={alert.severity === "warning" ? "text-yellow-600" : "text-red-600"} />
                    <p className="text-sm">{alert.text}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
