import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export interface Student {
  id: string; // Usaremos o CPF como ID único para facilitar a vinculação
  name: string;
  email: string;
  cpf: string;
  phone: string;
  objective: string;
  serviceType: string;
  plan: string;
  value: string;
}

export default function Students() {
  const [, setLocation] = useLocation();
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("performancefit_students");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    objective: "emagrecimento",
    serviceType: "personal",
    plan: "basico",
    value: "",
  });

  useEffect(() => {
    localStorage.setItem("performancefit_students", JSON.stringify(students));
  }, [students]);

  const handleAddStudent = () => {
    if (formData.name && formData.cpf && formData.value) {
      // Garante que o CPF é único e será o ID
      if (students.some(s => s.cpf === formData.cpf)) {
        alert("Já existe um aluno cadastrado com este CPF!");
        return;
      }
      setStudents([...students, { id: formData.cpf, ...formData }]);
      setFormData({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        objective: "emagrecimento",
        serviceType: "personal",
        plan: "basico",
        value: "",
      });
      setShowForm(false);
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      personal: "Personal Trainer",
      nutricionista: "Nutricionista",
      ambos: "Personal + Nutricionista",
    };
    return labels[type] || type;
  };

  const getPlanLabel = (plan: string) => {
    const labels: { [key: string]: string } = {
      basico: "Básico",
      intermediario: "Intermediário",
      premium: "Premium",
    };
    return labels[plan] || plan;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meus Alunos</h1>
            <p className="text-sm opacity-90">Gerencie seus alunos e acompanhamentos</p>
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
            <h2 className="text-2xl font-bold">Lista de Alunos</h2>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Aluno
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Adicionar Novo Aluno</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Informações Pessoais */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Nome</label>
                <Input
                  type="text"
                  placeholder="João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="joao@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">CPF</label>
                <Input
                  type="text"
                  placeholder="123.456.789-00" // Formato sugerido
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Telefone</label>
                <Input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Objetivo */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-2 block">Objetivo</label>
                <select
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="ganho-massa">Ganho de Massa</option>
                  <option value="definicao">Definição</option>
                  <option value="saude">Saúde Geral</option>
                </select>
              </div>

              {/* Tipo de Serviço */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Tipo de Serviço</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="personal">Personal Trainer</option>
                  <option value="nutricionista">Nutricionista</option>
                  <option value="ambos">Personal + Nutricionista</option>
                </select>
              </div>

              {/* Plano */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Plano</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="basico">Básico</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {/* Valor */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Valor Mensal (R$)</label>
                <Input
                  type="number"
                  placeholder="299.90"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddStudent}
                className="bg-accent text-accent-foreground"
              >
                Adicionar Aluno
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

        {students.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não tem alunos cadastrados</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              Cadastrar Primeiro Aluno
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {students.map((student) => (
              <Card key={student.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">R$ {parseFloat(student.value).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">/mês</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-mono text-sm">{student.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-semibold">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objetivo</p>
                    <p className="font-semibold capitalize">{student.objective}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Serviço</p>
                    <p className="font-semibold">{getServiceTypeLabel(student.serviceType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plano</p>
                    <p className="font-semibold">{getPlanLabel(student.plan)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
