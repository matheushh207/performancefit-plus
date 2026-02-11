import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Apple, Dumbbell, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { Student } from "./Students"; // Importa a interface Student

export default function StudentAccess() {
  const [cpf, setCpf] = useState("");
  const [, setLocation] = useLocation();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem("performancefit_students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const handleAccess = () => {
    const foundStudent = students.find(s => s.cpf === cpf);
    if (foundStudent) {
      localStorage.setItem("studentCPF", cpf);
      setLocation("/student-portal");
    } else {
      alert("CPF não encontrado. Verifique o número e tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-accent-foreground">PF+</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Portal do Aluno</h1>
          <p className="text-muted-foreground">Acesse seu treino, dieta e receitas</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">CPF</label>
            <Input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Button
          onClick={handleAccess}
          disabled={cpf.length < 11}
          className="w-full bg-accent text-accent-foreground hover:opacity-90 mb-4"
        >
          Acessar Portal
        </Button>

        <button
          onClick={() => setLocation("/")}
          className="w-full text-accent hover:underline text-sm"
        >
          Voltar para Home
        </button>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="font-semibold mb-4">O que você pode acessar:</h3>
          <div className="space-y-3">
            {[
              { icon: Dumbbell, text: "Seu treino atual" },
              { icon: Apple, text: "Seu plano nutricional" },
              { icon: Apple, text: "Receitas compatíveis" },
              { icon: FileText, text: "Relatórios de evolução" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <Icon size={18} className="text-accent" />
                  <span className="text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
