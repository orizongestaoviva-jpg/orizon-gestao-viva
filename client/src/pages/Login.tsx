/*
 * ORIZON — Gestão Viva
 * Login Page — Design "Viva Intelligence"
 * Split layout: left = hero image + brand, right = login form
 * Dark hero with indigo→violet gradient, white form panel
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Sparkles, Users, TrendingUp, Shield } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530315430/343ixLiM8FyvzGoB2fCnzG/orizon-hero-login-bLTwySxJEfBfzaXwn6938k.webp";

const features = [
  { icon: Users, label: "Gestão Completa de Pessoas" },
  { icon: TrendingUp, label: "Performance & OKRs em Tempo Real" },
  { icon: Sparkles, label: "Inteligência Artificial Integrada" },
  { icon: Shield, label: "Conformidade CLT, LGPD & NR-1" },
];

export default function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("demo@orizon.com.br");
  const [password, setPassword] = useState("orizon2025");
  const [role, setRole] = useState<UserRole>("tatico");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(email, password, role);
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero Panel */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-indigo-900/80 to-violet-900/70" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl orizon-gradient flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div>
            <div className="text-white font-bold text-xl tracking-tight">ORIZON</div>
            <div className="text-indigo-300 text-xs font-medium tracking-widest uppercase">Gestão Viva</div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            A plataforma mais<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-amber-300">
              completa de gestão
            </span><br />
            de pessoas do Brasil
          </h1>
          <p className="text-indigo-200 text-lg mb-10 max-w-md">
            Integre RH, vendas, cultura, performance e IA em uma única plataforma. Conformidade total com CLT, LGPD e NR-1.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/10">
                <Icon className="w-4 h-4 text-violet-300 shrink-0" />
                <span className="text-white/90 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: "500+", label: "Empresas" },
            { value: "50k+", label: "Colaboradores" },
            { value: "19", label: "Módulos" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-indigo-300 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl orizon-gradient flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">ORIZON</div>
              <div className="text-muted-foreground text-xs font-medium tracking-widest uppercase">Gestão Viva</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Bem-vindo de volta</h2>
            <p className="text-muted-foreground text-sm">Entre com suas credenciais para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo role selector */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Perfil de Acesso (Demo)</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operacional">Operacional — Colaborador</SelectItem>
                  <SelectItem value="tatico">Tático — Gestor / RH</SelectItem>
                  <SelectItem value="estrategico">Estratégico — Diretor</SelectItem>
                  <SelectItem value="admin">Admin Master</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Selecione um perfil para explorar as diferentes visões do sistema</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Lembrar de mim</span>
              </label>
              <button type="button" className="text-primary hover:underline font-medium">
                Esqueci a senha
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 orizon-gradient text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar no Sistema"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Ao entrar, você concorda com os{" "}
              <button className="text-primary hover:underline">Termos de Uso</button>
              {" "}e a{" "}
              <button className="text-primary hover:underline">Política de Privacidade</button>
              {" "}(LGPD)
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Não tem conta?{" "}
              <button className="text-primary hover:underline font-semibold">
                Solicitar demonstração
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
