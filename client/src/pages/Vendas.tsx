/*
 * ORIZON — Gestão Viva
 * Módulo: Vendas & Resultados
 * Dashboard de vendas, comissões CLT, DSR, metas, ranking
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  TrendingUp, DollarSign, Target, Award, Plus, Filter,
  Download, ArrowUpRight, ArrowDownRight, CheckCircle2,
  Clock, AlertTriangle, Sparkles, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const vendasDiarias = [
  { dia: "Seg", vendas: 12400, meta: 10000 },
  { dia: "Ter", vendas: 9800, meta: 10000 },
  { dia: "Qua", vendas: 14200, meta: 10000 },
  { dia: "Qui", vendas: 11600, meta: 10000 },
  { dia: "Sex", vendas: 16800, meta: 10000 },
  { dia: "Sáb", vendas: 8200, meta: 5000 },
];

const vendasMensais = [
  { mes: "Jan", vendas: 240000, comissao: 12000, dsr: 4800 },
  { mes: "Fev", vendas: 228000, comissao: 11400, dsr: 4560 },
  { mes: "Mar", vendas: 265000, comissao: 13250, dsr: 5300 },
  { mes: "Abr", vendas: 248000, comissao: 12400, dsr: 4960 },
];

const vendedores = [
  { id: 1, name: "Lucas Ferreira", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", vendas: 48200, meta: 45000, comissao: 2410, dsr: 964, status: "acima", posicao: 1 },
  { id: 2, name: "Beatriz Santos", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", vendas: 45800, meta: 45000, comissao: 2290, dsr: 916, status: "acima", posicao: 2 },
  { id: 3, name: "Rafael Lima", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", vendas: 42100, meta: 45000, comissao: 2105, dsr: 842, status: "abaixo", posicao: 3 },
  { id: 4, name: "Camila Rocha", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", vendas: 39500, meta: 45000, comissao: 1975, dsr: 790, status: "abaixo", posicao: 4 },
  { id: 5, name: "Thiago Alves", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", vendas: 38200, meta: 45000, comissao: 1910, dsr: 764, status: "abaixo", posicao: 5 },
  { id: 6, name: "Juliana Costa", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", vendas: 51400, meta: 45000, comissao: 2570, dsr: 1028, status: "acima", posicao: 6 },
];

const vendedoresSorted = [...vendedores].sort((a, b) => b.vendas - a.vendas).map((v, i) => ({ ...v, posicao: i + 1 }));

const registrosVendas = [
  { id: "V001", vendedor: "Lucas Ferreira", cliente: "Empresa ABC Ltda", valor: 8400, data: "08/04/2025", status: "aprovado", produto: "Plano Enterprise" },
  { id: "V002", vendedor: "Beatriz Santos", cliente: "Tech Solutions", valor: 5200, data: "08/04/2025", status: "pendente", produto: "Plano Pro" },
  { id: "V003", vendedor: "Juliana Costa", cliente: "Grupo Omega", valor: 12800, data: "07/04/2025", status: "aprovado", produto: "Plano Enterprise+" },
  { id: "V004", vendedor: "Rafael Lima", cliente: "StartupXYZ", valor: 3600, data: "07/04/2025", status: "aprovado", produto: "Plano Starter" },
  { id: "V005", vendedor: "Camila Rocha", cliente: "Distribuidora Sul", valor: 7100, data: "06/04/2025", status: "revisao", produto: "Plano Pro" },
];

export default function Vendas() {
  const [tab, setTab] = useState("dashboard");

  const totalVendas = vendedoresSorted.reduce((s, v) => s + v.vendas, 0);
  const totalComissoes = vendedoresSorted.reduce((s, v) => s + v.comissao, 0);
  const totalDSR = vendedoresSorted.reduce((s, v) => s + v.dsr, 0);
  const metaGeral = vendedoresSorted.reduce((s, v) => s + v.meta, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Vendas & Resultados</h1>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe metas, comissões CLT, DSR e ranking da equipe</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Filtros em breve")}>
            <Filter className="w-4 h-4 mr-2" />Filtrar
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Relatório exportado")}>
            <Download className="w-4 h-4 mr-2" />Exportar
          </Button>
          <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("Formulário de venda aberto")}>
            <Plus className="w-4 h-4 mr-2" />Registrar Venda
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vendas do Mês", value: `R$ ${(totalVendas/1000).toFixed(0)}k`, change: "+8,3%", up: true, icon: TrendingUp, color: "bg-indigo-600" },
          { label: "Total Comissões", value: `R$ ${(totalComissoes/1000).toFixed(1)}k`, change: "+8,3%", up: true, icon: DollarSign, color: "bg-violet-600" },
          { label: "DSR Calculado", value: `R$ ${(totalDSR/1000).toFixed(1)}k`, change: "CLT Art. 7", up: true, icon: CheckCircle2, color: "bg-emerald-600" },
          { label: "% Meta Atingida", value: `${Math.round(totalVendas/metaGeral*100)}%`, change: "+2,1%", up: true, icon: Target, color: "bg-amber-500" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="orizon-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={cn("text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1",
                    kpi.up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  )}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
                <div className="text-2xl font-extrabold tabular-nums">{kpi.value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{kpi.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="registros">Registros</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões & DSR</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="orizon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Vendas Diárias (Semana Atual)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={vendasDiarias}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                    <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} />
                    <Bar dataKey="vendas" fill="#3730A3" radius={[4, 4, 0, 0]} name="Vendas" />
                    <Bar dataKey="meta" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Meta" opacity={0.4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="orizon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Evolução Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={vendasMensais}>
                    <defs>
                      <linearGradient id="gVendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                    <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} />
                    <Area type="monotone" dataKey="vendas" stroke="#7C3AED" strokeWidth={2.5} fill="url(#gVendas)" name="Vendas" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI insight */}
          <Card className="orizon-card border-violet-200 bg-violet-50/50">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-violet-900">IA ORIZON — Análise de Vendas</div>
                <p className="text-sm text-violet-700 mt-1">
                  A equipe está a <strong>R$ 2.000</strong> de bater a meta mensal. Com base no histórico, as sextas-feiras têm 34% mais conversões. Recomendo focar esforços nos próximos 2 dias úteis com clientes em pipeline avançado.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Ranking de Vendas — Abril 2025
                </CardTitle>
                <Badge variant="outline">6 vendedores</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vendedoresSorted.map((v) => (
                  <div key={v.id} className={cn(
                    "flex items-center gap-4 p-3 rounded-xl border transition-colors",
                    v.posicao === 1 ? "bg-amber-50 border-amber-200" :
                    v.posicao === 2 ? "bg-slate-50 border-slate-200" :
                    v.posicao === 3 ? "bg-orange-50 border-orange-200" : "bg-background border-border"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                      v.posicao === 1 ? "bg-amber-400 text-white" :
                      v.posicao === 2 ? "bg-slate-400 text-white" :
                      v.posicao === 3 ? "bg-orange-400 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {v.posicao === 1 ? "🥇" : v.posicao === 2 ? "🥈" : v.posicao === 3 ? "🥉" : v.posicao}
                    </div>
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarImage src={v.avatar} />
                      <AvatarFallback>{v.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{v.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={Math.round(v.vendas/v.meta*100)} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground shrink-0">{Math.round(v.vendas/v.meta*100)}%</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm tabular-nums">R$ {v.vendas.toLocaleString("pt-BR")}</div>
                      <div className={cn("text-xs font-medium", v.status === "acima" ? "text-emerald-600" : "text-rose-500")}>
                        {v.status === "acima" ? "▲ Acima da meta" : "▼ Abaixo da meta"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registros" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Registros de Vendas</CardTitle>
                <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("Formulário aberto")}>
                  <Plus className="w-4 h-4 mr-2" />Nova Venda
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">ID</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Vendedor</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Cliente</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Produto</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">Valor</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Data</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosVendas.map((r) => (
                      <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                        <td className="py-3 px-3 font-medium">{r.vendedor}</td>
                        <td className="py-3 px-3 text-muted-foreground">{r.cliente}</td>
                        <td className="py-3 px-3 text-muted-foreground">{r.produto}</td>
                        <td className="py-3 px-3 text-right font-bold tabular-nums">R$ {r.valor.toLocaleString("pt-BR")}</td>
                        <td className="py-3 px-3 text-muted-foreground">{r.data}</td>
                        <td className="py-3 px-3">
                          <span className={cn("orizon-badge-emerald",
                            r.status === "pendente" && "orizon-badge-amber",
                            r.status === "revisao" && "orizon-badge-rose"
                          )}>
                            {r.status === "aprovado" ? "✓ Aprovado" : r.status === "pendente" ? "⏳ Pendente" : "⚠ Revisão"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info("Detalhes da venda")}>
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comissoes" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="orizon-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Comissões CLT — Abril 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vendedoresSorted.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={v.avatar} />
                        <AvatarFallback className="text-xs">{v.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{v.name}</div>
                        <div className="text-xs text-muted-foreground">5% sobre R$ {v.vendas.toLocaleString("pt-BR")}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm text-emerald-600">R$ {v.comissao.toLocaleString("pt-BR")}</div>
                        <div className="text-xs text-muted-foreground">DSR: R$ {v.dsr.toLocaleString("pt-BR")}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="text-xs text-indigo-600 font-semibold mb-1">📋 Base Legal</div>
                  <p className="text-xs text-indigo-700">Comissões calculadas conforme CLT Art. 466. DSR calculado sobre comissões conforme Súmula 27 TST. Aprovação do gestor obrigatória antes do fechamento da folha.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="orizon-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Bonificações Configuráveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Bater 100% da meta", bonus: "R$ 500,00", tipo: "individual", ativo: true },
                  { label: "Superar 120% da meta", bonus: "R$ 1.200,00", tipo: "individual", ativo: true },
                  { label: "Time bate meta coletiva", bonus: "R$ 300,00/pessoa", tipo: "equipe", ativo: true },
                  { label: "Maior venda do mês", bonus: "R$ 800,00", tipo: "ranking", ativo: false },
                  { label: "Cliente novo captado", bonus: "R$ 200,00/cliente", tipo: "individual", ativo: true },
                ].map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-semibold">{b.label}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("orizon-badge-indigo", b.tipo === "equipe" && "orizon-badge-violet", b.tipo === "ranking" && "orizon-badge-amber")}>
                          {b.tipo}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{b.bonus}</div>
                      <span className={cn("text-xs font-medium", b.ativo ? "text-emerald-600" : "text-muted-foreground")}>
                        {b.ativo ? "● Ativo" : "○ Inativo"}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" onClick={() => toast.info("Editor de bonificações em breve")}>
                  <Plus className="w-4 h-4 mr-2" />Adicionar Bonificação
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
