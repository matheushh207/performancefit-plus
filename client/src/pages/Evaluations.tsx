import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, ArrowLeft, Camera, Activity, Heart, Target, Ruler } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supebase";
import { toast } from "sonner";

export default function Evaluations() {
  const [, setLocation] = useLocation();
  const { data: students = [] } = trpc.students.list.useQuery();
  const { data: assessments = [], refetch } = trpc.physicalEvaluations.list.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: 0,
    weight: "",
    height: "",
    bodyFatPercentage: "",
    evaluationDate: new Date().toISOString().split('T')[0],
    // Medidas
    cintura: "",
    abdomen: "",
    quadril: "",
    peitoral: "",
    bracoRelaxado: "",
    bracoContraido: "",
    coxa: "",
    panturrilha: "",
    // Saúde
    pressao: "",
    frequenciaCardiaca: "",
    lesoes: "",
    medicamentos: "",
    // Estratégico
    objetivo: "",
    observations: "",
    photoBeforeUrl: "",
    photoAfterUrl: "",
  });

  const createAssessment = trpc.physicalEvaluations.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      resetForm();
      toast.success("Avaliação criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar avaliação: " + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      studentId: 0,
      weight: "",
      height: "",
      bodyFatPercentage: "",
      evaluationDate: new Date().toISOString().split('T')[0],
      cintura: "",
      abdomen: "",
      quadril: "",
      peitoral: "",
      bracoRelaxado: "",
      bracoContraido: "",
      coxa: "",
      panturrilha: "",
      pressao: "",
      frequenciaCardiaca: "",
      lesoes: "",
      medicamentos: "",
      objetivo: "",
      observations: "",
      photoBeforeUrl: "",
      photoAfterUrl: "",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${type}.${fileExt}`;
      const filePath = `evaluations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('evaluations')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('evaluations')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [type === 'before' ? 'photoBeforeUrl' : 'photoAfterUrl']: publicUrl
      }));

      toast.success("Foto enviada com sucesso!");
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddAssessment = () => {
    if (formData.studentId && formData.weight && formData.height) {
      createAssessment.mutate(formData);
    } else {
      toast.error("Preencha os campos obrigatórios (Aluno, Peso e Altura)");
    }
  };

  const handleDeleteAssessment = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
      deleteAssessment.mutate({ id });
    }
  };

  const deleteAssessment = trpc.physicalEvaluations.delete.useMutation({
    onSuccess: () => refetch()
  });

  const getStudentName = (id: number) => {
    const s = students.find(st => st.id === id);
    return s ? s.fullName : "Desconhecido";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Avaliações Físicas</h1>
            <p className="text-sm opacity-90">Gestão completa de medidas e evolução</p>
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

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Histórico</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Avaliação
          </Button>
        </div>

        {showForm && (
          <div className="space-y-6">
            {/* Seção 1: Dados Básicos */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Activity className="text-accent" size={20} />
                <h3 className="text-xl font-bold">1. Dados Básicos</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Aluno *</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value={0}>Selecione...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Data *</label>
                  <Input type="date" value={formData.evaluationDate} onChange={e => setFormData({ ...formData, evaluationDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Peso (kg) *</label>
                  <Input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="Ex: 80" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Altura (cm) *</label>
                  <Input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder="Ex: 175" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">% Gordura *</label>
                  <Input type="number" value={formData.bodyFatPercentage} onChange={e => setFormData({ ...formData, bodyFatPercentage: e.target.value })} placeholder="Ex: 15" />
                </div>
              </div>
            </Card>

            {/* Seção 2: Medidas Corporais */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Ruler className="text-accent" size={20} />
                <h3 className="text-xl font-bold">2. Medidas Corporais (cm)</h3>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {['peitoral', 'cintura', 'abdomen', 'quadril', 'bracoRelaxado', 'bracoContraido', 'coxa', 'panturrilha'].map(field => (
                  <div key={field}>
                    <label className="text-sm font-semibold mb-2 block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <Input type="number" value={(formData as any)[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Seção 3: Saúde e Estratégia */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b pb-2">
                  <Heart className="text-accent" size={20} />
                  <h3 className="text-xl font-bold">3. Saúde</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Pressão Art.</label>
                      <Input value={formData.pressao} onChange={e => setFormData({ ...formData, pressao: e.target.value })} placeholder="12/8" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Freq. Cardíaca</label>
                      <Input type="number" value={formData.frequenciaCardiaca} onChange={e => setFormData({ ...formData, frequenciaCardiaca: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Lesões</label>
                    <Input value={formData.lesoes} onChange={e => setFormData({ ...formData, lesoes: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Medicamentos</label>
                    <Input value={formData.medicamentos} onChange={e => setFormData({ ...formData, medicamentos: e.target.value })} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b pb-2">
                  <Target className="text-accent" size={20} />
                  <h3 className="text-xl font-bold">4. Estratégia</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Objetivo</label>
                    <Input value={formData.objetivo} onChange={e => setFormData({ ...formData, objetivo: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Observações</label>
                    <textarea
                      className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background"
                      value={formData.observations}
                      onChange={e => setFormData({ ...formData, observations: e.target.value })}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Seção 4: Fotos */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Camera className="text-accent" size={20} />
                <h3 className="text-xl font-bold">5. Fotos (Antes e Depois)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-center">Foto Anterior</label>
                  <div className="border-2 border-dashed border-border rounded-lg h-40 flex flex-col items-center justify-center relative overflow-hidden bg-muted/20">
                    {formData.photoBeforeUrl ? (
                      <img src={formData.photoBeforeUrl} className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="text-muted-foreground opacity-20" size={48} />
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'before')} disabled={isUploading} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-center">Foto Atual</label>
                  <div className="border-2 border-dashed border-border rounded-lg h-40 flex flex-col items-center justify-center relative overflow-hidden bg-muted/20">
                    {formData.photoAfterUrl ? (
                      <img src={formData.photoAfterUrl} className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="text-muted-foreground opacity-20" size={48} />
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'after')} disabled={isUploading} />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleAddAssessment} className="h-12 flex-1 bg-accent text-accent-foreground text-lg font-bold" disabled={createAssessment.isPending || isUploading}>
                {createAssessment.isPending ? "Salvando..." : "Salvar Avaliação Completa"}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="h-12 px-8">Cancelar</Button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {assessments.map((item: any) => (
            <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{getStudentName(item.studentId)}</h3>
                    <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full font-semibold">
                      {new Date(item.evaluationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mt-4">
                    <Metric label="Peso" value={`${item.weight} kg`} />
                    <Metric label="Gordura" value={`${item.bodyFatPercentage}%`} />
                    <Metric label="IMC" value={item.imc} />
                    <Metric label="TMB" value={`${item.tmb} kcal`} />
                    <Metric label="GC Est." value={`${item.gastoCalorico} kcal`} />
                    <Metric label="RCQ" value={item.relacaoCinturaQuadril} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDeleteAssessment(item.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className="text-base font-bold text-foreground">{value || "-"}</p>
    </div>
  );
}