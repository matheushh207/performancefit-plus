import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Download } from "lucide-react";
import { useLocation } from "wouter";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function StudentReports() {
  const [, setLocation] = useLocation();

  const progressData = [
    { month: "Jan", weight: 85, bodyFat: 18, muscle: 35 },
    { month: "Fev", weight: 84, bodyFat: 17.5, muscle: 35.5 },
    { month: "Mar", weight: 82, bodyFat: 16.8, muscle: 36.2 },
    { month: "Abr", weight: 80, bodyFat: 15.5, muscle: 37 },
  ];

  const adherenceData = [
    { name: "Treino", value: 95, fill: "#8B5CF6" },
    { name: "Dieta", value: 90, fill: "#7C3AED" },
    { name: "Descanso", value: 85, fill: "#A78BFA" },
  ];

  const measurementsData = [
    { name: "Peito", value: 98 },
    { name: "Cintura", value: 82 },
    { name: "Quadril", value: 95 },
    { name: "Coxa", value: 58 },
    { name: "Braço", value: 32 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📊 Seu Progresso</h1>
            <p className="text-sm opacity-90">Evolução e comparativos com gráficos</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2">
              <Download size={18} />
              Baixar PDF
            </Button>
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
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Gráfico de Evolução de Peso e Gordura */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-accent" />
            Evolução de Peso e Gordura Corporal
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8B5CF6" strokeWidth={2} name="Peso (kg)" />
              <Line type="monotone" dataKey="bodyFat" stroke="#7C3AED" strokeWidth={2} name="Gordura (%)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de Massa Muscular */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Evolução de Massa Muscular</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="muscle" fill="#A78BFA" name="Massa Muscular (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de Aderência */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Taxa de Aderência (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={adherenceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {adherenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Medidas Corporais (cm)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={measurementsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" name="Medida (cm)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Resumo */}
        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="text-2xl font-bold mb-4">📈 Resumo Geral</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Peso Perdido</p>
              <p className="text-3xl font-bold text-accent">5 kg</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Gordura Reduzida</p>
              <p className="text-3xl font-bold text-accent">2.5%</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Músculo Ganho</p>
              <p className="text-3xl font-bold text-accent">2 kg</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Aderência Média</p>
              <p className="text-3xl font-bold text-accent">90%</p>
            </div>
          </div>
        </Card>

        {/* Dicas */}
        <Card className="p-6 bg-green-500/5 border-green-500/20">
          <h3 className="font-bold mb-2 text-green-600">✅ Parabéns!</h3>
          <p className="text-muted-foreground">
            Você está indo muito bem! Continue mantendo a consistência com o treino e a dieta. Seus resultados estão excelentes!
          </p>
        </Card>
      </div>
    </div>
  );
}