import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Apple, Activity, Calendar } from "lucide-react";

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
                {/* Avaliações */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-accent" />
                            Última Avaliação
                        </h2>
                        {evaluations.length > 0 ? (
                            <div className="space-y-3">
                                {(() => {
                                    const lastEval = evaluations[evaluations.length - 1];
                                    return (
                                        <>
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">Data</span>
                                                <span className="font-medium">{new Date(lastEval.evaluationDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">Peso</span>
                                                <span className="font-medium">{lastEval.weight} kg</span>
                                            </div>
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">Altura</span>
                                                <span className="font-medium">{lastEval.height} m</span>
                                            </div>
                                            <div className="flex justify-between border-b border-border pb-2">
                                                <span className="text-muted-foreground">% Gordura</span>
                                                <span className="font-medium">{lastEval.bodyFatPercentage}%</span>
                                            </div>
                                        </>
                                    );
                                })()}
                                <Button variant="outline" className="w-full mt-4" disabled>Ver Histórico Completo</Button>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhuma avaliação registrada.</p>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-accent" />
                            Informações Pessoais
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Data de Nascimento</p>
                                <p className="font-medium">{student.birthDate ? new Date(student.birthDate).toLocaleDateString() : 'Não informada'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Telefone</p>
                                <p className="font-medium">{student.phone || 'Não informado'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Gênero</p>
                                <p className="font-medium capitalize">{student.gender === 'male' ? 'Masculino' : student.gender === 'female' ? 'Feminino' : 'Outro'}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Treinos e Dietas */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Dumbbell size={20} className="text-accent" />
                                Treinos Atribuídos
                            </h2>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setLocation(`/workouts?studentId=${studentId}`)}
                            >
                                Novo Treino
                            </Button>
                        </div>

                        {workouts.length > 0 ? (
                            <div className="grid gap-3">
                                {workouts.map((workout: any) => (
                                    <div key={workout.id} className="bg-secondary/10 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold">{workout.name}</h3>
                                            <p className="text-sm text-muted-foreground capitalize">{workout.type}</p>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            {new Date(workout.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Este aluno não possui treinos.</p>
                        )}
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Apple size={20} className="text-accent" />
                                Planos Alimentares
                            </h2>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setLocation(`/nutrition?studentId=${studentId}`)}
                            >
                                Nova Dieta
                            </Button>
                        </div>

                        {diets.length > 0 ? (
                            <div className="grid gap-3">
                                {diets.map((diet: any) => (
                                    <div key={diet.id} className="bg-secondary/10 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold">{diet.name}</h3>
                                            <p className="text-sm text-muted-foreground capitalize">{diet.type}</p>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            {new Date(diet.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Este aluno não possui dietas.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
