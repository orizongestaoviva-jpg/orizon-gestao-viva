/**
 * ORIZON — Gestão Viva
 * Dashboard Estratégico: Indicadores consolidados e visão executiva
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp, Users, AlertTriangle, Target,
  ArrowUpRight, ArrowDownRight, DollarSign, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const revenueData = [
  { mes: "Out", revenue: 1850000, target: 2000000 },
  { mes: "Nov", revenue: 2200000, target: 2000000 },
  { mes: "Dez", revenue: 1950000, target: 2100000 },
  { mes: "Jan", revenue: 2400000, target: 2200000 },
  { mes: "Fev", revenue: 2280000, target: 2300000 },
  { mes: "Mar", revenue: 2650000, target: 2400000 },
  { mes: "Abr", revenue: 2480000, target: 2500000 },
];

const departmentPerformance = [
  { dept: "Vendas", meta: 100, atingido: 99, pessoas: 45, turnover: 8.2 },
  { dept: "TI", meta: 100, atingido: 95, pessoas: 28, turnover: 3.5 },
  { dept: "RH", meta: 100, atingido: 100, pessoas: 12, turnover: 0 },
  { dept: "Marketing", meta: 100, atingido: 87, pessoas: 18, turnover: 11.2 },
  { dept: "Operações", meta: 100, atingido: 92, pessoas: 51, turnover: 6.8 },
];

const strategyOkrs = [
  { goal: "Crescer receita em 25%", kr1: "Aumentar ticket médio para R$ 3.200", kr1Progress: 78, kr2: "Expandir para 3 novos mercados", kr2Progress: 45 },
  { goal: "Reduzir turnover para 7%", kr1: "Implementar programa de retenção", kr1Progress: 45, kr2: "Aumentar NPS interno para 75", kr2Progress: 62 },
  { goal: "100% dos colaboradores com PDI", kr1: "Criar trilhas personalizadas por área", kr1Progress: 52, kr2: "Realizar 12 treinamentos por pessoa/ano", kr2Progress: 38 },
];

const marketComparison = [
  { metric: "Receita por Colaborador", ours: 16100, market: 14200 },
  { metric: "Custo de Turnover", ours: 8.4, market: 10.2 },
  { metric: "NPS Interno", ours: 68, market: 62 },
  { metric: "Tempo Médio Contratação", ours: 32, market: 45 },
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
    <Card>
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
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export default function DashboardEstrategico() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Bom dia, Fernanda 👋</h1>
          <p className="text-sm text-muted-foreground">
            quarta-feira, 8 de abril de 2026 · Diretora de Pessoas · Diretoria
          </p>
        </div>
        <Button>Exportar Dashboard</Button>
      </div>

      {/* KPIs Estratégicos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Receita Total (Acumulado)"
          value="R$ 15.8M"
          change="+12,5%"
          positive={true}
          icon={DollarSign}
          color="bg-emerald-500"
          subtitle="vs. período anterior"
        />
        <KpiCard
          title="Total de Colaboradores"
          value="154"
          change="+2,1%"
          positive={true}
          icon={Users}
          color="bg-indigo-500"
          subtitle="Crescimento anual"
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
        <KpiCard
          title="Eficiência Operacional"
          value="92%"
          change="+3,8%"
          positive={true}
          icon={Zap}
          color="bg-amber-500"
          subtitle="Índice geral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita vs. Target */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita vs. Target</CardTitle>
            <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#059669" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="target" stroke="#f59e0b" fillOpacity={0} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentPerformance.map((dept, idx) => (
                <div key={idx} className="pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{dept.dept}</p>
                    <span className="text-xs font-semibold text-foreground">{dept.atingido}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{dept.pessoas} pessoas</span>
                    <span>•</span>
                    <span className={dept.turnover > 8 ? "text-rose-600" : "text-emerald-600"}>
                      Turnover: {dept.turnover}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OKRs Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">OKRs Estratégicos — Q2 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {strategyOkrs.map((okr, idx) => (
              <div key={idx} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <p className="font-semibold text-foreground mb-3">{okr.goal}</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-muted-foreground">{okr.kr1}</p>
                      <span className="text-xs font-semibold">{okr.kr1Progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${okr.kr1Progress}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-muted-foreground">{okr.kr2}</p>
                      <span className="text-xs font-semibold">{okr.kr2Progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${okr.kr2Progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benchmarking vs. Mercado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Benchmarking vs. Mercado</CardTitle>
          <p className="text-xs text-muted-foreground">Comparação com empresas similares</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketComparison.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{item.metric}</p>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {typeof item.ours === "number" && item.ours > 100 ? `R$ ${item.ours.toLocaleString()}` : item.ours}
                    </p>
                    <p className="text-xs text-emerald-600">Nós</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {typeof item.market === "number" && item.market > 100 ? `R$ ${item.market.toLocaleString()}` : item.market}
                    </p>
                    <p className="text-xs text-muted-foreground">Mercado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
