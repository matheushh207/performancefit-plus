import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface Assessment {
  id: number;
  studentName: string;
  weight: string;
  height: string;
  bodyFat: string;
  date: string;
}

interface FormData {
  studentName: string;
  weight: string;
  height: string;
  bodyFat: string;
  date: string;
}

export default function Evaluations() {
  const [, setLocation] = useLocation();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    weight: "",
    height: "",
    bodyFat: "",
    date: new Date().toISOString().split('T')[0],
  });

  const calculateIMC = (weight: string, height: string) => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w && h) {
      return (w / ((h / 100) ** 2)).toFixed(1);
    }
    return "-";
  };

  const handleAddAssessment = () => {
    if (formData.studentName && formData.weight && formData.height) {
      const newAssessment: Assessment = {
        id: Date.now(),
        ...formData,
      };
      setAssessments([...assessments, newAssessment]);
      setFormData({
        studentName: "",
        weight: "",
        height: "",
        bodyFat: "",
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
    }
  };

  const handleDeleteAssessment = (id: number) => {
    setAssessments(assessments.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Avaliações Físicas</h1>
            <p className="text-sm opacity-90">Registre avaliações físicas completas</p>
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
            <h2 className="text-2xl font-bold">Avaliações</h2>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Avaliação
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Adicionar Nova Avaliação</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Nome do Aluno</label>
                <Input
                  type="text"
                  placeholder="João Silva"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Data</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Peso (kg)</label>
                <Input
                  type="number"
                  placeholder="75"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Altura (cm)</label>
                <Input
                  type="number"
                  placeholder="180"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-2 block">% de Gordura Corporal</label>
                <Input
                  type="number"
                  placeholder="20"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddAssessment}
                className="bg-accent text-accent-foreground"
              >
                Adicionar Avaliação
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

        {assessments.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não tem avaliações cadastradas</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              Adicionar Primeira Avaliação
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {assessments.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.studentName}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Peso</p>
                        <p className="font-semibold">{item.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Altura</p>
                        <p className="font-semibold">{item.height} cm</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">% Gordura</p>
                        <p className="font-semibold">{item.bodyFat}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">IMC</p>
                        <p className="font-semibold">{calculateIMC(item.weight, item.height)}</p>
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
                      onClick={() => handleDeleteAssessment(item.id)}
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