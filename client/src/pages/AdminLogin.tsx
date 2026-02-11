import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setError("");
    if (username === "matheus" && password === "1926") {
      localStorage.setItem("adminToken", "authenticated");
      setLocation("/admin/panel");
    } else {
      setError("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Admin</h1>
          <p className="text-muted-foreground">PerformaceFit+</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Usuário</label>
            <Input
              type="text"
              placeholder="matheus"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          className="w-full bg-accent text-accent-foreground hover:opacity-90 mb-4"
        >
          Entrar
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
