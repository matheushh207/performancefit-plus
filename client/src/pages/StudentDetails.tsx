import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Apple, Activity, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StudentDetails() {
    const [, setLocation] = useLocation();
    const [, params] = useRoute("/student/:id");
    const studentId = params ? parseInt(params.id) : 0;

    const { data, isLoading } = trpc.students.get.useQuery(
        { id: studentId },
        { enabled: !!studentId }
    );

    useEffect(() => {
        const token = localStorage.getItem("professionalJwt");
        if (!token) {
            setLocation("/professional/login");
        }
    }, [setLocation]);

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Carregando perfil do aluno...</div>;
    }

    if (!data?.student) {
        return (
            <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Aluno não encontrado.</p>
                <Button onClick={() => setLocation("/professional/dashboard")}>Voltar ao Dashboard</Button>
            </div>
        );
    }

    const { student, workouts, diets, evaluations } = data;

    // Ordenar avaliações por data (caso não venham ordenadas)
    const sortedEvals = [...evaluations].sort((a, b) =>
        new Date(a.evaluationDate).getTime() - new Date(b.evaluationDate).getTime()
    );

    const lastEval = sortedEvals[sortedEvals.length - 1];
    const prevEval = sortedEvals[sortedEvals.length - 2];

    const getDiff = (current: any, previous: any) => {
        if (!previous) return null;
        const diff = parseFloat(current) - parseFloat(previous);
        return {
            value: Math.abs(diff).toFixed(1),
            isIncrease: diff > 0,
            isDecrease: diff < 0,
            isNeutral: diff === 0
        };
    };

    // Preparar dados para o gráfico
    const chartData = sortedEvals.map(ev => ({
        data: new Date(ev.evaluationDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        peso: parseFloat(ev.weight),
        gordura: parseFloat(ev.bodyFatPercentage),
        cintura: parseFloat(ev.cintura || "0"),
        abdomen: parseFloat(ev.abdomen || "0"),
    }));

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
                <div className="max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        className="text-accent-foreground hover:bg-white/10 mb-4 pl-0"
                        onClick={() => setLocation("/professional/dashboard")}
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Voltar
                    </Button>
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{student.fullName}</h1>
                            <p className="opacity-90 mt-1">CPF: {student.cpf} | Email: {student.email || 'Não informado'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-80">Objetivo</p>
                            <p className="font-semibold">{student.objective || 'Não definido'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-6">
                {/* Lateral: Resumo */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-accent" />
                            Última Avaliação
                        </h2>
                        {lastEval ? (
                            <div className="space-y-4">
                                <ComparisonRow
                                    label="Peso"
                                    current={`${lastEval.weight} kg`}
                                    diff={getDiff(lastEval.weight, prevEval?.weight)}
                                    invertColor // Peso menor geralmente é melhor (depende do objetivo, mas seguindo padrão comum)
                                />
                                <ComparisonRow
                                    label="% Gordura"
                                    current={`${lastEval.bodyFatPercentage}%`}
                                    diff={getDiff(lastEval.bodyFatPercentage, prevEval?.bodyFatPercentage)}
                                    invertColor
                                />
                                <ComparisonRow
                                    label="IMC"
                                    current={lastEval.imc || "-"}
                                    diff={getDiff(lastEval.imc, prevEval?.imc)}
                                    invertColor
                                />
                                <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                                    <div className="text-center p-2 bg-secondary/5 rounded">
                                        <p className="text-xs text-muted-foreground uppercase">M. Magra</p>
                                        <p className="font-bold">{lastEval.leanMass || "-"} kg</p>
                                    </div>
                                    <div className="text-center p-2 bg-secondary/5 rounded">
                                        <p className="text-xs text-muted-foreground uppercase">M. Gorda</p>
                                        <p className="font-bold">{lastEval.fatMass || "-"} kg</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full" onClick={() => setLocation("/professional/evaluations")}>Ver Todas Avaliações</Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground mb-4">Nenhuma avaliação.</p>
                                <Button size="sm" onClick={() => setLocation("/professional/evaluations")}>Fazer Primeira Avaliação</Button>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-accent" />
                            Dados Pessoais
                        </h2>
                        <div className="space-y-4 text-sm">
                            <PersonalInfo label="Nascimento" value={student.birthDate ? new Date(student.birthDate).toLocaleDateString() : 'Não informada'} />
                            <PersonalInfo label="Telefone" value={student.phone || 'Não informado'} />
                            <PersonalInfo label="Gênero" value={student.gender === 'male' ? 'Masculino' : student.gender === 'female' ? 'Feminino' : 'Outro'} />
                        </div>
                    </Card>
                </div>

                {/* Central: Gráficos e Ações */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp size={20} className="text-accent" />
                                Evolução Corporal
                            </h2>
                        </div>

                        {chartData.length >= 2 ? (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                        <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="#C69242" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="gordura" name="% Gordura" stroke="#000" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="aspect-video bg-secondary/5 rounded-lg flex items-center justify-center text-muted-foreground italic">
                                Gráfico será exibido após 2 ou mais avaliações.
                            </div>
                        )}
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <ActionCard
                            title="Treinos"
                            icon={<Dumbbell size={20} />}
                            items={workouts}
                            onNew={() => setLocation(`/workouts?studentId=${studentId}`)}
                            type="workout"
                        />
                        <ActionCard
                            title="Dieta"
                            icon={<Apple size={20} />}
                            items={diets}
                            onNew={() => setLocation(`/nutrition?studentId=${studentId}`)}
                            type="diet"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComparisonRow({ label, current, diff, invertColor = false }: any) {
    if (!diff) return (
        <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-bold">{current}</span>
        </div>
    );

    const isGood = invertColor ? diff.isDecrease : diff.isIncrease;
    const colorClass = diff.isNeutral ? "text-muted-foreground" : isGood ? "text-green-500" : "text-red-500";

    return (
        <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">{label}</span>
            <div className="text-right">
                <p className="font-bold">{current}</p>
                <p className={`text-xs flex items-center justify-end gap-0.5 ${colorClass}`}>
                    {diff.isIncrease ? <ArrowUpRight size={12} /> : diff.isDecrease ? <ArrowDownRight size={12} /> : null}
                    {diff.value}
                </p>
            </div>
        </div>
    );
}

function PersonalInfo({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col">
            <label className="text-xs text-muted-foreground font-semibold uppercase">{label}</label>
            <p className="font-bold text-base">{value}</p>
        </div>
    );
}

function ActionCard({ title, icon, items, onNew, type }: any) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    {icon}
                    {title}
                </h2>
                <Button size="sm" variant="outline" onClick={onNew}>Novo</Button>
            </div>
            {items.length > 0 ? (
                <div className="space-y-2">
                    {items.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="p-3 bg-secondary/5 rounded-lg text-sm flex justify-between">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                    ))}
                    {items.length > 3 && <p className="text-[10px] text-center text-muted-foreground mt-2">Veja mais no dashboard</p>}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground text-center py-4 italic">Nenhum registro encontrado.</p>
            )}
        </Card>
    );
}
