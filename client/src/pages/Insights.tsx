import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Insights() {
  const [, setLocation] = useLocation();

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Aluno Estagnado",
      description: "João Silva não apresentou progresso nos últimos 30 dias",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      id: 2,
      type: "danger",
      title: "Déficit Calórico Agressivo",
      description: "Maria Santos está com déficit calórico muito alto",
      icon: AlertCircle,
      color: "red",
    },
    {
      id: 3,
      type: "success",
      title: "Progresso Excelente",
      description: "Pedro Costa atingiu sua meta de peso",
      icon: CheckCircle,
      color: "green",
    },
  ];

  const suggestions = [
    {
      id: 1,
      student: "João Silva",
      suggestion: "Aumentar intensidade do treino em 20%",
      priority: "high",
    },
    {
      id: 2,
      student: "Maria Santos",
      suggestion: "Aumentar ingestão calórica em 300 kcal",
      priority: "high",
    },
    {
      id: 3,
      student: "Pedro Costa",
      suggestion: "Manter rotina atual - resultado excelente",
      priority: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inteligência</h1>
            <p className="text-sm opacity-90">Veja alertas e sugestões automáticas</p>
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
        {/* Alertas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Alertas Importantes</h2>
          <div className="grid gap-4">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              const bgColor = alert.color === "yellow" ? "bg-yellow-500/10 border-yellow-500/20" : 
                             alert.color === "red" ? "bg-red-500/10 border-red-500/20" :
                             "bg-green-500/10 border-green-500/20";
              const textColor = alert.color === "yellow" ? "text-yellow-600" : 
                               alert.color === "red" ? "text-red-600" :
                               "text-green-600";

              return (
                <Card key={alert.id} className={`p-6 border ${bgColor}`}>
                  <div className="flex items-start gap-4">
                    <Icon size={24} className={textColor} />
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sugestões */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Sugestões de Ação</h2>
          <div className="grid gap-4">
            {suggestions.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">{item.student}</h3>
                    <p className="text-muted-foreground mb-3">{item.suggestion}</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-accent" />
                      <span className="text-sm font-semibold capitalize">
                        Prioridade: {item.priority === "high" ? "Alta" : "Baixa"}
                      </span>
                    </div>
                  </div>
                  <Button className="bg-accent text-accent-foreground">
                    Aplicar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Estatísticas Gerais</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Alunos Ativos</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <TrendingUp size={32} className="text-accent opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Progresso Positivo</p>
                  <p className="text-3xl font-bold">92%</p>
                </div>
                <CheckCircle size={32} className="text-green-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Alertas Pendentes</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <AlertCircle size={32} className="text-yellow-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Taxa de Retenção</p>
                  <p className="text-3xl font-bold">87%</p>
                </div>
                <TrendingUp size={32} className="text-accent opacity-20" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}