import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogOut, Plus, Trash2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    type: "personal_trainer" as "personal_trainer" | "nutritionist" | "both",
    specialization: "",
    crefNumber: "",
    crnNumber: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { data: professionals = [], refetch } = trpc.professionals.list.useQuery();
  const createMutation = trpc.professionals.create.useMutation({
    onSuccess: () => {
      toast.success("Profissional cadastrado com sucesso!");
      setFormData({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        type: "personal_trainer",
        specialization: "",
        crefNumber: "",
        crnNumber: "",
        password: "",
      });
      setShowForm(false);
      refetch();
    },
    onError: (err) => {
      if (err.message === "EMAIL_OR_CPF_ALREADY_EXISTS") {
        setError("Email ou CPF já cadastrado!");
      } else {
        setError("Erro ao cadastrar profissional. Tente novamente.");
      }
    },
  });

  const deleteMutation = trpc.professionals.delete.useMutation({
    onSuccess: () => {
      toast.success("Profissional removido com sucesso!");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao remover profissional.");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin/login");
  };

  const handleAddProfessional = async () => {
    setError("");
    // Apenas os campos realmente vitais continuam obrigatórios
    if (!formData.name || !formData.email || !formData.cpf || !formData.password) {
      setError("Preencha os campos obrigatórios (Nome, Email, CPF e Senha)!");
      return;
    }

    try {
      await createMutation.mutateAsync({
        fullName: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone || undefined,
        type: formData.type,
        specialization: formData.specialization || undefined,
        // Envia o que tiver preenchido, priorizando o tipo do profissional
        licenseNumber: formData.type === "nutritionist" ? (formData.crnNumber || undefined) : (formData.crefNumber || undefined),
        password: formData.password,
      });
    } catch (err) {
      // Erro já tratado no onError
    }
  };

  const handleDeleteProfessional = async (id: number) => {
    if (confirm("Tem certeza que deseja remover este profissional?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel Admin</h1>
            <p className="text-sm opacity-90">PerformaceFit+ - Gerenciamento de Profissionais</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Profissionais</h2>
            <p className="text-muted-foreground">Cadastre e gerencie profissionais (campos com * são obrigatórios)</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Profissional
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Cadastrar Novo Profissional</h3>
            
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                <AlertCircle size={18} className="text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Nome Completo *</label>
                <Input
                  type="text"
                  placeholder="João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Email *</label>
                <Input
                  type="email"
                  placeholder="joao@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">CPF *</label>
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Telefone</label>
                <Input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="personal_trainer">Personal Trainer</option>
                  <option value="nutritionist">Nutricionista</option>
                  <option value="both">Ambos</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Especialização</label>
                <Input
                  type="text"
                  placeholder="Ganho de Massa, Emagrecimento..."
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
              
              {(formData.type === "personal_trainer" || formData.type === "both") && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">Número do CREF (Opcional)</label>
                  <Input
                    type="text"
                    placeholder="CREF 000000-G/UF"
                    value={formData.crefNumber}
                    onChange={(e) => setFormData({ ...formData, crefNumber: e.target.value })}
                  />
                </div>
              )}

              {(formData.type === "nutritionist" || formData.type === "both") && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">Número do CRN (Opcional)</label>
                  <Input
                    type="text"
                    placeholder="CRN-X 0000"
                    value={formData.crnNumber}
                    onChange={(e) => setFormData({ ...formData, crnNumber: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 block">Senha *</label>
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddProfessional}
                disabled={createMutation.isPending}
                className="bg-accent text-accent-foreground"
              >
                {createMutation.isPending ? "Cadastrando..." : "Cadastrar"}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {professionals.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum profissional cadastrado ainda</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              Cadastrar Primeiro Profissional
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {professionals.map((prof) => (
              <Card key={prof.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{prof.fullName}</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-mono">{prof.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CPF</p>
                        <p className="font-mono">{prof.cpf}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Registro Profissional</p>
                        <p className="font-semibold">{prof.licenseNumber || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tipo</p>
                        <p className="font-semibold">
                          {prof.type === "personal_trainer" && "Personal Trainer"}
                          {prof.type === "nutritionist" && "Nutricionista"}
                          {prof.type === "both" && "Ambos"}
                        </p>
                      </div>
                      {prof.specialization && (
                        <div>
                          <p className="text-muted-foreground">Especialização</p>
                          <p className="font-semibold">{prof.specialization}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="text-green-600 font-semibold">Ativo</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => handleDeleteProfessional(prof.id)}
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