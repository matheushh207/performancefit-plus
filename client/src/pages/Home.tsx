import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Dumbbell, Apple, TrendingUp, Users, Zap, ArrowRight, LogIn, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">PF+</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              PerformaceFit+
            </span>
          </div>
          <a href="/professional/login" className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <LogIn size={18} /> Profissional
          </a>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Gestão Profissional para <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">Personal Trainers e Nutricionistas</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Plataforma B2B completa para gerenciar avaliações físicas, treinos personalizados, dietas inteligentes e acompanhamento de alunos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap mb-16">
            <a href="/professional/login" className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-w-48">
              <LogIn size={20} /> Entrar como Profissional
            </a>
            <button onClick={() => setLocation("/student-access")} className="border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent/10 transition-colors flex items-center justify-center gap-2 min-w-48">
              <Eye size={20} /> Portal do Aluno
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border text-center text-muted-foreground">
        <p>© 2026 PerformaceFit+. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
