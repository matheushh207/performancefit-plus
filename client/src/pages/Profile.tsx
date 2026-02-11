import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Lock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 99999-9999",
    city: "São Paulo",
    specialization: "Personal Trainer",
    yearsExperience: "5",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = () => {
    setEditMode(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-foreground p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-sm opacity-90">Gerencie seus dados e plano</p>
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
        {/* Dados Pessoais */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Dados Pessoais</h2>
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "default" : "outline"}
            >
              {editMode ? "Salvar" : "Editar"}
            </Button>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Nome</label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Telefone</label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Cidade</label>
                <Input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Especialização</label>
                <Input
                  type="text"
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Anos de Experiência</label>
                <Input
                  type="number"
                  value={profileData.yearsExperience}
                  onChange={(e) => setProfileData({ ...profileData, yearsExperience: e.target.value })}
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="bg-accent text-accent-foreground"
              >
                Salvar Alterações
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-semibold">{profileData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-semibold">{profileData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-semibold">{profileData.city}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Especialização</p>
                <p className="font-semibold">{profileData.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anos de Experiência</p>
                <p className="font-semibold">{profileData.yearsExperience} anos</p>
              </div>
            </div>
          )}
        </Card>

        {/* Alterar Senha */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Segurança</h2>
            <Button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              variant={showPasswordForm ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Lock size={18} />
              {showPasswordForm ? "Cancelar" : "Alterar Senha"}
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Senha Atual</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Nova Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Confirmar Nova Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleChangePassword} className="bg-accent text-accent-foreground">
                  Alterar Senha
                </Button>
                <Button onClick={() => setShowPasswordForm(false)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
