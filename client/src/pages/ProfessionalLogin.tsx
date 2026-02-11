import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ProfessionalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const loginMutation = trpc.auth.loginProfessional.useMutation();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await loginMutation.mutateAsync({ email, password });

      window.localStorage.setItem("professionalJwt", result.token);
      window.localStorage.setItem(
        "professionalInfo",
        JSON.stringify(result.professional),
      );

      setLocation("/professional/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciais inválidas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Acesso Profissional</h1>
          <p className="text-muted-foreground">PerformaceFit+ - Portal do Profissional</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Senha</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          disabled={isSubmitting}
          className="w-full bg-accent text-accent-foreground hover:opacity-90 mb-4"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <button
          onClick={() => setLocation("/")}
          className="w-full text-accent hover:underline text-sm"
        >
          Voltar para Home
        </button>
      </Card>
    </div>
  );
}
