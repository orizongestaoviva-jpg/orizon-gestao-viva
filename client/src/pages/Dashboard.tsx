/*
 * ORIZON — Gestão Viva
 * Dashboard Page — Visão adaptativa por nível hierárquico
 * KPIs, gráficos Recharts, cards de atividade recente
 */

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Users, TrendingUp, Clock, AlertTriangle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Sparkles, Target, Heart,
  UserPlus, Award, Calendar, BarChart3, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const salesData = [
  { mes: "Out", vendas: 185000, meta: 200000 },
  { mes: "Nov", vendas: 220000, meta: 200000 },
  { mes: "Dez", vendas: 195000, meta: 210000 },
  { mes: "Jan", vendas: 240000, meta: 220000 },
  { mes: "Fev", vendas: 228000, meta: 230000 },
  { mes: "Mar", vendas: 265000, meta: 240000 },
  { mes: "Abr", vendas: 248000, meta: 250000 },
];

const headcountData = [
  { mes: "Out", ativos: 142, desligados: 3, contratados: 5 },
  { mes: "Nov", ativos: 144, desligados: 2, contratados: 4 },
  { mes: "Dez", ativos: 146, desligados: 1, contratados: 3 },
  { mes: "Jan", ativos: 148, desligados: 4, contratados: 6 },
  { mes: "Fev", ativos: 150, desligados: 2, contratados: 4 },
  { mes: "Mar", ativos: 152, desligados: 3, contratados: 5 },
  { mes: "Abr", ativos: 154, desligados: 1, contratados: 3 },
];

const climaData = [
  { name: "Muito Satisfeito", value: 38, color: "#059669" },
  { name: "Satisfeito", value: 32, color: "#7C3AED" },
  { name: "Neutro", value: 18, color: "#F59E0B" },
  { name: "Insatisfeito", value: 8, color: "#EF4444" },
  { name: "Muito Insatisfeito", value: 4, color: "#991B1B" },
];

const recentActivities = [
  { user: "Ana Souza", action: "Registrou ponto de entrada", time: "há 5 min", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", type: "ponto" },
  { user: "Carlos Mendes", action: "Aprovou férias de 3 colaboradores", time: "há 12 min", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", type: "ferias" },
  { user: "IA ORIZON", action: "Detectou risco de turnover em Vendas", time: "há 23 min", avatar: "", type: "ia" },
  { user: "Pedro Costa", action: "Concluiu trilha de treinamento", time: "há 45 min", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", type: "treinamento" },
  { user: "Mariana Silva", action: "Enviou avaliação 360° completa", time: "há 1h", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face", type: "avaliacao" },
];

const topPerformers = [
  { name: "Lucas Ferreira", dept: "Vendas", score: 98, sales: "R$ 48.200", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
  { name: "Beatriz Santos", dept: "Vendas", score: 95, sales: "R$ 45.800", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
  { name: "Rafael Lima", dept: "Vendas", score: 92, sales: "R$ 42.100", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
  { name: "Camila Rocha", dept: "Vendas", score: 89, sales: "R$ 39.500", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
];

const aiInsights = [
  { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", text: "Risco de turnover elevado no setor de Vendas (3 colaboradores com sinais de insatisfação)", action: "Ver análise" },
  { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", text: "Meta de vendas de Abril está 99% atingida — projeção de superação em 2 dias", action: "Ver detalhes" },
  { icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", text: "5 colaboradores com aniversário de empresa esta semana — oportunidade de reconhecimento", action: "Reconhecer" },
  { icon: Heart, color: "text-rose-600", bg: "bg-rose-50", text: "Índice de bem-estar caiu 8% no último mês — recomendação: pesquisa de clima urgente", action: "Iniciar pesquisa" },
];

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

function KpiCard({ title, value, change, positive, icon: Icon, color, subtitle }: KpiCardProps) {
  return (
    <Card className="orizon-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        </div>
        <div className="text-2xl font-extrabold text-foreground tabular-nums">{value}</div>
        <div className="text-sm font-medium text-muted-foreground mt-0.5">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const isStrategic = user?.role === "estrategico" || user?.role === "admin";
  const isTactical = user?.role === "tatico" || isStrategic;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Bom dia, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {" · "}{user?.position} · {user?.department}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Relatório exportado")}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("IA analisando dados...")}>
            <Sparkles className="w-4 h-4 mr-2" />
            Insights IA
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Colaboradores Ativos"
          value="154"
          change="+2,1%"
          positive={true}
          icon={Users}
          color="bg-indigo-600"
          subtitle="3 contratações este mês"
        />
        <KpiCard
          title="Vendas do Mês"
          value="R$ 248k"
          change="+8,3%"
          positive={true}
          icon={TrendingUp}
          color="bg-violet-600"
          subtitle="99% da meta atingida"
        />
        <KpiCard
          title="Horas Extras (Mês)"
          value="342h"
          change="-12%"
          positive={true}
          icon={Clock}
          color="bg-amber-500"
          subtitle="Banco de horas: 89 pessoas"
        />
        <KpiCard
          title="Turnover (Anual)"
          value="8,4%"
          change="+1,2%"
          positive={false}
          icon={AlertTriangle}
          color="bg-rose-500"
          subtitle="Acima da meta de 7%"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <Card className="orizon-card lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Vendas vs. Meta</CardTitle>
              <Badge variant="outline" className="text-xs">Últimos 7 meses</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="vendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3730A3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3730A3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="meta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} />
                <Area type="monotone" dataKey="vendas" stroke="#3730A3" strokeWidth={2.5} fill="url(#vendas)" name="Vendas" />
                <Area type="monotone" dataKey="meta" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" fill="url(#meta)" name="Meta" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Clima Pie */}
        <Card className="orizon-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Clima Organizacional</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={climaData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {climaData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {climaData.slice(0, 3).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Headcount Chart */}
        {isTactical && (
          <Card className="orizon-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Headcount</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={headcountData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="contratados" fill="#059669" radius={[3, 3, 0, 0]} name="Contratados" />
                  <Bar dataKey="desligados" fill="#EF4444" radius={[3, 3, 0, 0]} name="Desligados" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Performers */}
        <Card className="orizon-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Top Vendedores</CardTitle>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  i === 0 ? "bg-amber-100 text-amber-700" :
                  i === 1 ? "bg-slate-100 text-slate-600" :
                  i === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback className="text-[10px]">{p.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sales}</div>
                </div>
                <div className="text-xs font-bold text-emerald-600">{p.score}pts</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className={cn("orizon-card", !isTactical && "lg:col-span-2")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                {a.type === "ia" ? (
                  <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                ) : (
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={a.avatar} />
                    <AvatarFallback className="text-[10px]">{a.user[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold">{a.user}</span>
                  <span className="text-sm text-muted-foreground"> {a.action}</span>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="orizon-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <CardTitle className="text-base font-bold">Insights da IA ORIZON</CardTitle>
            <Badge className="bg-violet-100 text-violet-700 text-[10px]">4 alertas</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiInsights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <div key={i} className={cn("flex items-start gap-3 p-3 rounded-lg border", insight.bg)}>
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", insight.bg)}>
                    <Icon className={cn("w-4 h-4", insight.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{insight.text}</p>
                    <button
                      className={cn("text-xs font-semibold mt-1.5", insight.color)}
                      onClick={() => toast.info("Análise detalhada em breve")}
                    >
                      {insight.action} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* OKRs Progress (Tactical+) */}
      {isTactical && (
        <Card className="orizon-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-base font-bold">OKRs — Q2 2025</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Navegando para Metas")}>
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { obj: "Crescer receita em 25%", kr: "KR1: Aumentar ticket médio para R$ 3.200", progress: 78, color: "bg-indigo-600" },
              { obj: "Reduzir turnover para 7%", kr: "KR2: Implementar programa de retenção", progress: 45, color: "bg-violet-600" },
              { obj: "Atingir NPS interno de 75", kr: "KR3: Realizar 3 pesquisas de clima", progress: 67, color: "bg-amber-500" },
              { obj: "100% dos colaboradores com PDI", kr: "KR4: Criar trilhas personalizadas por área", progress: 52, color: "bg-emerald-600" },
            ].map((okr, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <div className="text-sm font-semibold">{okr.kr}</div>
                    <div className="text-xs text-muted-foreground">{okr.obj}</div>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{okr.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", okr.color)}
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
