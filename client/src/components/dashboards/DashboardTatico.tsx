/**
 * ORIZON — Gestão Viva
 * Dashboard Tático: Visão de time, performance, metas e indicadores gerenciais
 */

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
  Users, TrendingUp, AlertTriangle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Target, Heart, Award
} from "lucide-react";
import { cn } from "@/lib/utils";

const salesData = [
  { mes: "Out", vendas: 185000, meta: 200000 },
  { mes: "Nov", vendas: 220000, meta: 200000 },
  { mes: "Dez", vendas: 195000, meta: 210000 },
  { mes: "Jan", vendas: 240000, meta: 220000 },
  { mes: "Fev", vendas: 228000, meta: 230000 },
  { mes: "Mar", vendas: 265000, meta: 240000 },
  { mes: "Abr", vendas: 248000, meta: 250000 },
];

const teamPerformance = [
  { name: "Lucas Ferreira", dept: "Vendas", score: 98, sales: "R$ 48.200", status: "excelente" },
  { name: "Beatriz Santos", dept: "Vendas", score: 95, sales: "R$ 45.800", status: "excelente" },
  { name: "Rafael Lima", dept: "Vendas", score: 82, sales: "R$ 32.100", status: "bom" },
  { name: "Camila Rocha", dept: "Vendas", score: 71, sales: "R$ 29.500", status: "atencao" },
];

const climaData = [
  { name: "Muito Satisfeito", value: 38, color: "#059669" },
  { name: "Satisfeito", value: 32, color: "#7C3AED" },
  { name: "Neutro", value: 18, color: "#F59E0B" },
  { name: "Insatisfeito", value: 8, color: "#EF4444" },
  { name: "Muito Insatisfeito", value: 4, color: "#991B1B" },
];

const teamAlerts = [
  { id: 1, title: "Risco de turnover: Rafael com sinais de insatisfação", type: "warning", priority: "high" },
  { id: 2, title: "Camila não atingiu meta de vendas 3 meses seguidos", type: "alert", priority: "high" },
  { id: 3, title: "Mariana completou trilha de treinamento com 98/100", type: "success", priority: "low" },
  { id: 4, title: "Pedro está 15 dias sem registrar férias", type: "info", priority: "medium" },
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

export default function DashboardTatico() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Bom dia, Carlos 👋</h1>
          <p className="text-sm text-muted-foreground">
            quarta-feira, 8 de abril de 2026 · Gerente de RH · Recursos Humanos
          </p>
        </div>
        <Button>Exportar Relatório</Button>
      </div>

      {/* KPIs do Time */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Colaboradores Ativos"
          value="154"
          change="+2,1%"
          positive={true}
          icon={Users}
          color="bg-indigo-500"
          subtitle="3 contratações este mês"
        />
        <KpiCard
          title="Vendas do Mês"
          value="R$ 248k"
          change="+8,3%"
          positive={true}
          icon={TrendingUp}
          color="bg-emerald-500"
          subtitle="99% da meta atingida"
        />
        <KpiCard
          title="Horas Extras (Mês)"
          value="342h"
          change="-12%"
          positive={true}
          icon={Award}
          color="bg-amber-500"
          subtitle="Banco de horas: 89 pessoas"
        />
        <KpiCard
          title="Turnover (Anual)"
          value="8,4%"
          change="+1,2%"
          positive={false}
          icon={Heart}
          color="bg-rose-500"
          subtitle="Acima da meta de 7%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Vendas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vendas vs. Meta</CardTitle>
              <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Area type="monotone" dataKey="vendas" stroke="#7C3AED" fillOpacity={1} fill="url(#colorVendas)" />
                  <Area type="monotone" dataKey="meta" stroke="#f59e0b" fillOpacity={0} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Clima Organizacional */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clima Organizacional</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={climaData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {climaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {climaData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance do Time */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance do Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((member, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.dept}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={member.score} className="h-1.5" />
                        <span className="text-xs font-semibold text-foreground">{member.score}pts</span>
                      </div>
                    </div>
                    <Badge className={cn(
                      member.status === "excelente" ? "bg-emerald-100 text-emerald-700" :
                      member.status === "bom" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {member.sales}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas do Time */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alertas do Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teamAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border text-sm",
                      alert.type === "warning" ? "bg-amber-50 border-amber-200" :
                      alert.type === "alert" ? "bg-rose-50 border-rose-200" :
                      alert.type === "success" ? "bg-emerald-50 border-emerald-200" :
                      "bg-blue-50 border-blue-200"
                    )}
                  >
                    <p className={cn(
                      "font-medium",
                      alert.type === "warning" ? "text-amber-900" :
                      alert.type === "alert" ? "text-rose-900" :
                      alert.type === "success" ? "text-emerald-900" :
                      "text-blue-900"
                    )}>
                      {alert.title}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
