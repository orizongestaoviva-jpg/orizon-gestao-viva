/*
 * ORIZON — Gestão Viva
 * Módulo: Avaliação de Desempenho
 * 90°/180°/360°, feedback contínuo, 1:1, OKRs
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import {
  Target, Star, MessageSquare, Users, TrendingUp, Sparkles,
  Plus, CheckCircle2, Clock, ChevronRight, BarChart3, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const avaliacoes = [
  { id: 1, nome: "Ana Souza", cargo: "Consultora de Vendas", tipo: "360°", status: "em_andamento", progresso: 75, score: null, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" },
  { id: 2, nome: "Carlos Mendes", cargo: "Gerente de RH", tipo: "180°", status: "concluida", progresso: 100, score: 88, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  { id: 3, nome: "Lucas Ferreira", cargo: "Consultor Sênior", tipo: "360°", status: "concluida", progresso: 100, score: 96, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
  { id: 4, nome: "Beatriz Santos", cargo: "Analista de Marketing", tipo: "90°", status: "pendente", progresso: 0, score: null, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
];

const competencias = [
  { competencia: "Comunicação", autoavaliacao: 8, gestor: 7, pares: 7.5 },
  { competencia: "Liderança", autoavaliacao: 7, gestor: 8, pares: 7.8 },
  { competencia: "Resultados", autoavaliacao: 9, gestor: 9, pares: 8.5 },
  { competencia: "Inovação", autoavaliacao: 8, gestor: 7.5, pares: 7 },
  { competencia: "Trabalho em Equipe", autoavaliacao: 9, gestor: 8.5, pares: 9 },
  { competencia: "Desenvolvimento", autoavaliacao: 7, gestor: 7, pares: 7.5 },
];

const okrs = [
  {
    objetivo: "Crescer receita em 25% no Q2",
    responsavel: "Equipe de Vendas",
    progresso: 78,
    krs: [
      { kr: "Aumentar ticket médio para R$ 3.200", progresso: 85 },
      { kr: "Conquistar 15 novos clientes enterprise", progresso: 73 },
      { kr: "Reduzir churn para menos de 5%", progresso: 80 },
    ]
  },
  {
    objetivo: "Reduzir turnover para 7% ao ano",
    responsavel: "RH",
    progresso: 45,
    krs: [
      { kr: "Implementar programa de retenção", progresso: 60 },
      { kr: "Realizar 3 pesquisas de clima", progresso: 67 },
      { kr: "100% dos colaboradores com PDI", progresso: 52 },
    ]
  },
];

export default function Avaliacao() {
  const [tab, setTab] = useState("avaliacoes");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Avaliação de Desempenho & OKRs</h1>
          <p className="text-muted-foreground text-sm mt-1">Avaliações 90°/180°/360°, feedback contínuo, 1:1 e metas</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("Nova avaliação criada")}>
            <Plus className="w-4 h-4 mr-2" />Nova Avaliação
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          <TabsTrigger value="360">Resultado 360°</TabsTrigger>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & 1:1</TabsTrigger>
        </TabsList>

        <TabsContent value="avaliacoes" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {avaliacoes.map((a) => (
              <Card key={a.id} className="orizon-card cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => toast.info(`Avaliação de ${a.nome}`)}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={a.avatar} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{a.nome[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{a.nome}</div>
                      <div className="text-xs text-muted-foreground">{a.cargo}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="orizon-badge-indigo text-[10px]">{a.tipo}</span>
                        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                          a.status === "concluida" ? "bg-emerald-100 text-emerald-700" :
                          a.status === "em_andamento" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                        )}>
                          {a.status === "concluida" ? "✓ Concluída" : a.status === "em_andamento" ? "⏳ Em andamento" : "○ Pendente"}
                        </span>
                      </div>
                    </div>
                    {a.score && (
                      <div className="text-center shrink-0">
                        <div className="text-2xl font-extrabold text-indigo-700">{a.score}</div>
                        <div className="text-[10px] text-muted-foreground">Score</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold">{a.progresso}%</span>
                  </div>
                  <Progress value={a.progresso} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="360" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="orizon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Radar de Competências — Lucas Ferreira</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={competencias}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="competencia" tick={{ fontSize: 10, fill: "#888" }} />
                    <Radar name="Autoavaliação" dataKey="autoavaliacao" stroke="#3730A3" fill="#3730A3" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="Gestor" dataKey="gestor" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="Pares" dataKey="pares" stroke="#059669" fill="#059669" fillOpacity={0.1} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs mt-2">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-700 inline-block" />Autoavaliação</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block" />Gestor</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-600 inline-block" />Pares</span>
                </div>
              </CardContent>
            </Card>

            <Card className="orizon-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Detalhamento por Competência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {competencias.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="font-medium">{c.competencia}</span>
                      <span className="font-bold text-indigo-700">{((c.autoavaliacao + c.gestor + c.pares) / 3).toFixed(1)}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.autoavaliacao * 10}%` }} />
                      </div>
                      <div className="flex-1 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${c.gestor * 10}%` }} />
                      </div>
                      <div className="flex-1 h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${c.pares * 10}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="orizon-card border-violet-200 bg-violet-50/30 mt-4">
            <CardContent className="p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-violet-900">IA — Feedback Estruturado</div>
                <p className="text-sm text-violet-700 mt-1">
                  Lucas demonstra excelência em Resultados e Trabalho em Equipe. Ponto de desenvolvimento: Comunicação (diferença de 1 ponto entre autoavaliação e percepção dos pares). Recomendo incluir no PDI um curso de comunicação executiva e apresentações de alto impacto.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="okrs" className="mt-4 space-y-4">
          {okrs.map((okr, i) => (
            <Card key={i} className="orizon-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-base">{okr.objetivo}</div>
                    <div className="text-sm text-muted-foreground">{okr.responsavel}</div>
                  </div>
                  <div className="text-center shrink-0 ml-4">
                    <div className="text-2xl font-extrabold text-indigo-700 tabular-nums">{okr.progresso}%</div>
                    <div className="text-xs text-muted-foreground">Progresso</div>
                  </div>
                </div>
                <Progress value={okr.progresso} className="h-2 mb-4" />
                <div className="space-y-2">
                  {okr.krs.map((kr, j) => (
                    <div key={j} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                      <Target className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-sm flex-1">{kr.kr}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${kr.progresso}%` }} />
                        </div>
                        <span className="text-xs font-bold tabular-nums">{kr.progresso}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full" onClick={() => toast.info("Novo OKR criado")}>
            <Plus className="w-4 h-4 mr-2" />Adicionar Objetivo
          </Button>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="orizon-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Feedbacks Recentes</CardTitle>
                  <Button size="sm" className="orizon-gradient text-white h-7 text-xs" onClick={() => toast.success("Feedback enviado!")}>
                    <Plus className="w-3.5 h-3.5 mr-1" />Dar Feedback
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { de: "Carlos Mendes", para: "Ana Souza", tipo: "positivo", msg: "Excelente apresentação para o cliente ABC! Muito bem preparada.", data: "07/04" },
                  { de: "Fernanda Lima", para: "Carlos Mendes", tipo: "positivo", msg: "Ótima condução do processo seletivo. Candidatos de alta qualidade.", data: "05/04" },
                  { de: "Carlos Mendes", para: "Lucas Ferreira", tipo: "desenvolvimento", msg: "Atenção ao prazo de entrega dos relatórios semanais.", data: "03/04" },
                ].map((f, i) => (
                  <div key={i} className={cn("p-3 rounded-xl border",
                    f.tipo === "positivo" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
                  )}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold">{f.de}</span>
                      <span className="text-xs text-muted-foreground">→ {f.para}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{f.data}</span>
                    </div>
                    <p className="text-sm">{f.msg}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="orizon-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Reuniões 1:1 Agendadas</CardTitle>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info("Agendar 1:1")}>
                    <Plus className="w-3.5 h-3.5 mr-1" />Agendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { gestor: "Carlos Mendes", colaborador: "Ana Souza", data: "10/04/2025", hora: "14:00", pauta: "PDI e metas Q2" },
                  { gestor: "Carlos Mendes", colaborador: "Lucas Ferreira", data: "11/04/2025", hora: "10:00", pauta: "Feedback avaliação 360°" },
                  { gestor: "Fernanda Lima", colaborador: "Carlos Mendes", data: "14/04/2025", hora: "09:00", pauta: "Resultados do time" },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{r.gestor} × {r.colaborador}</div>
                      <div className="text-xs text-muted-foreground">{r.data} às {r.hora}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Pauta: {r.pauta}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info("Entrar na reunião")}>
                      Entrar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
