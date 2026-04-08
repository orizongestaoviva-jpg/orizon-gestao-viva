/*
 * ORIZON — Gestão Viva
 * Módulo: Clima Organizacional
 * Pesquisas estratégicas, relatórios, IA para riscos humanos
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line
} from "recharts";
import {
  Heart, TrendingUp, AlertTriangle, Sparkles, Plus,
  BarChart3, Users, Star, ChevronRight, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const radarData = [
  { dimensao: "Liderança", score: 78 },
  { dimensao: "Comunicação", score: 72 },
  { dimensao: "Reconhecimento", score: 65 },
  { dimensao: "Desenvolvimento", score: 80 },
  { dimensao: "Bem-estar", score: 70 },
  { dimensao: "Propósito", score: 85 },
];

const evolucaoClima = [
  { mes: "Out", score: 68 },
  { mes: "Nov", score: 71 },
  { mes: "Dez", score: 69 },
  { mes: "Jan", score: 73 },
  { mes: "Fev", score: 75 },
  { mes: "Mar", score: 72 },
  { mes: "Abr", score: 74 },
];

const perguntasRecentes = [
  { pergunta: "Você se sente valorizado(a) pela sua liderança?", media: 7.2, respostas: 142 },
  { pergunta: "A empresa oferece oportunidades de crescimento?", media: 8.1, respostas: 142 },
  { pergunta: "Você recomendaria a empresa para um amigo?", media: 7.8, respostas: 142 },
  { pergunta: "Você tem equilíbrio entre vida pessoal e trabalho?", media: 6.9, respostas: 142 },
  { pergunta: "A comunicação interna é clara e eficiente?", media: 7.0, respostas: 142 },
];

export default function Clima() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Clima Organizacional</h1>
          <p className="text-muted-foreground text-sm mt-1">Pesquisas estratégicas, análise de risco e insights de IA</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("Nova pesquisa criada com IA")}>
          <Sparkles className="w-4 h-4 mr-2" />Nova Pesquisa com IA
        </Button>
      </div>

      {/* Score geral */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="orizon-card lg:col-span-1 orizon-gradient text-white">
          <CardContent className="p-6 text-center">
            <div className="text-6xl font-extrabold tabular-nums mb-1">74</div>
            <div className="text-white/80 text-sm mb-3">Score de Clima</div>
            <div className="text-white/60 text-xs">Acima da média do setor (71)</div>
            <div className="mt-4 flex justify-center gap-1">
              {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 text-amber-300 fill-amber-300" />)}
              <Star className="w-4 h-4 text-white/30" />
            </div>
          </CardContent>
        </Card>
        {[
          { label: "Participação", value: "92%", sub: "138/150 responderam", icon: Users, color: "bg-indigo-600" },
          { label: "eNPS", value: "+42", sub: "Promotores: 68%", icon: TrendingUp, color: "bg-emerald-600" },
          { label: "Risco de Turnover", value: "Médio", sub: "3 colaboradores em alerta", icon: AlertTriangle, color: "bg-amber-500" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="orizon-card">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-extrabold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.sub}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="pesquisas">Pesquisas</TabsTrigger>
          <TabsTrigger value="ia">IA & Riscos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="orizon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Radar de Dimensões</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimensao" tick={{ fontSize: 11, fill: "#888" }} />
                    <Radar name="Score" dataKey="score" stroke="#3730A3" fill="#3730A3" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="orizon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Evolução do Clima (7 meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={evolucaoClima}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill: "#7C3AED", r: 4 }} name="Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Resultados por Pergunta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {perguntasRecentes.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-muted-foreground flex-1 pr-4">{p.pergunta}</span>
                    <span className="font-bold tabular-nums shrink-0">{p.media}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={p.media * 10} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground shrink-0">{p.respostas} respostas</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pesquisas" className="mt-4">
          <div className="space-y-3">
            {[
              { titulo: "Pesquisa de Clima Q1 2025", data: "15/03/2025", participacao: 92, status: "concluida" },
              { titulo: "Pulse Check — Fevereiro", data: "28/02/2025", participacao: 88, status: "concluida" },
              { titulo: "Pesquisa de Clima Q2 2025", data: "Previsto: 15/06/2025", participacao: 0, status: "agendada" },
              { titulo: "Pesquisa de Bem-estar (NR-1)", data: "Previsto: 30/04/2025", participacao: 0, status: "rascunho" },
            ].map((p, i) => (
              <Card key={i} className="orizon-card cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => toast.info(`Pesquisa: ${p.titulo}`)}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    p.status === "concluida" ? "bg-emerald-100" : p.status === "agendada" ? "bg-amber-100" : "bg-muted"
                  )}>
                    <BarChart3 className={cn("w-5 h-5", p.status === "concluida" ? "text-emerald-600" : p.status === "agendada" ? "text-amber-600" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{p.titulo}</div>
                    <div className="text-xs text-muted-foreground">{p.data}</div>
                    {p.participacao > 0 && (
                      <div className="text-xs text-muted-foreground">{p.participacao}% de participação</div>
                    )}
                  </div>
                  <span className={cn(
                    p.status === "concluida" ? "orizon-badge-emerald" :
                    p.status === "agendada" ? "orizon-badge-amber" : "bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
                  )}>
                    {p.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ia" className="mt-4 space-y-4">
          <Card className="orizon-card border-violet-200 bg-violet-50/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <div className="font-bold text-base text-violet-900 mb-2">IA ORIZON — Análise de Riscos Humanos</div>
                  <div className="space-y-2 text-sm text-violet-700">
                    <p>🔴 <strong>Alto risco de desligamento:</strong> 3 colaboradores do setor de Vendas apresentam padrão de baixo engajamento nas últimas 4 semanas.</p>
                    <p>🟡 <strong>Atenção:</strong> O índice de bem-estar caiu 8% no último mês. Recomendo uma pesquisa de clima emergencial e 1:1 com os gestores.</p>
                    <p>🟢 <strong>Positivo:</strong> O setor de TI apresenta o maior score de satisfação (82/100) — boas práticas podem ser replicadas.</p>
                  </div>
                  <Button size="sm" className="mt-3 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => toast.success("Relatório completo gerado")}>
                    Gerar Relatório Completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { setor: "Vendas", score: 68, risco: "Alto", colaboradores: 24, cor: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
              { setor: "RH", score: 79, risco: "Baixo", colaboradores: 8, cor: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
              { setor: "TI", score: 82, risco: "Baixo", colaboradores: 15, cor: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
              { setor: "Marketing", score: 74, risco: "Médio", colaboradores: 10, cor: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
              { setor: "Financeiro", score: 71, risco: "Médio", colaboradores: 12, cor: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
              { setor: "Operações", score: 76, risco: "Baixo", colaboradores: 20, cor: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
            ].map((s, i) => (
              <Card key={i} className={cn("orizon-card border", s.bg)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-sm">{s.setor}</div>
                    <span className={cn("text-xs font-bold", s.cor)}>Risco {s.risco}</span>
                  </div>
                  <div className="text-3xl font-extrabold tabular-nums mb-1">{s.score}</div>
                  <div className="text-xs text-muted-foreground mb-2">{s.colaboradores} colaboradores</div>
                  <Progress value={s.score} className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
