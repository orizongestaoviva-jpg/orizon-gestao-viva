/*
 * ORIZON — Gestão Viva
 * Módulo: Saúde & Bem-estar (NR-1)
 * Mapa de riscos psicossociais, alertas, ações preventivas
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart, AlertTriangle, Shield, Sparkles, Plus,
  CheckCircle2, Clock, Users, TrendingUp, Brain, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const riscosPsicossociais = [
  { fator: "Sobrecarga de trabalho", nivel: "alto", afetados: 12, setor: "Vendas" },
  { fator: "Conflitos interpessoais", nivel: "medio", afetados: 5, setor: "Operações" },
  { fator: "Falta de autonomia", nivel: "baixo", afetados: 3, setor: "Financeiro" },
  { fator: "Insegurança no trabalho", nivel: "medio", afetados: 8, setor: "Geral" },
  { fator: "Assédio moral/sexual", nivel: "baixo", afetados: 0, setor: "Geral" },
];

const acoesPreventivas = [
  { acao: "Programa de mindfulness semanal", status: "ativo", participantes: 45, impacto: "Alto" },
  { acao: "Canal anônimo de denúncias", status: "ativo", participantes: 154, impacto: "Alto" },
  { acao: "Sessões de psicologia online (Zenklub)", status: "ativo", participantes: 28, impacto: "Alto" },
  { acao: "Treinamento antissédio para gestores", status: "agendado", participantes: 18, impacto: "Médio" },
  { acao: "Ginástica laboral 3x/semana", status: "ativo", participantes: 60, impacto: "Médio" },
];

export default function Saude() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Saúde & Bem-estar</h1>
          <p className="text-muted-foreground text-sm mt-1">Conformidade NR-1 · Riscos psicossociais · Ações preventivas</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("Relatório NR-1 gerado")}>
          <Shield className="w-4 h-4 mr-2" />Gerar Relatório NR-1
        </Button>
      </div>

      {/* NR-1 Banner */}
      <Card className="orizon-card border-indigo-200 bg-indigo-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-indigo-900">Conformidade NR-1 — Gestão de Riscos Psicossociais</div>
            <p className="text-xs text-indigo-700 mt-1">
              A NR-1 (atualizada em 2024) exige que as empresas incluam riscos psicossociais no Programa de Gerenciamento de Riscos (PGR). 
              O ORIZON automatiza o mapeamento, monitoramento e plano de ação conforme a norma.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="orizon-badge-emerald text-[10px]">PGR Atualizado</span>
              <span className="orizon-badge-emerald text-[10px]">PCMSO Integrado</span>
              <span className="orizon-badge-amber text-[10px]">Revisão: Jun/2025</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Índice de Bem-estar", value: "74/100", icon: Heart, color: "bg-rose-500" },
          { label: "Afastamentos (Mês)", value: 2, icon: Activity, color: "bg-amber-500" },
          { label: "Ações Ativas", value: acoesPreventivas.filter(a => a.status === "ativo").length, icon: CheckCircle2, color: "bg-emerald-600" },
          { label: "Colaboradores em Risco", value: 12, icon: AlertTriangle, color: "bg-rose-500" },
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Riscos</TabsTrigger>
          <TabsTrigger value="acoes">Ações Preventivas</TabsTrigger>
          <TabsTrigger value="ia">IA & Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Mapa de Riscos Psicossociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riscosPsicossociais.map((r, i) => (
                <div key={i} className={cn("flex items-center gap-4 p-4 rounded-xl border",
                  r.nivel === "alto" ? "bg-rose-50 border-rose-200" :
                  r.nivel === "medio" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
                )}>
                  <div className={cn("w-3 h-3 rounded-full shrink-0",
                    r.nivel === "alto" ? "bg-rose-500" : r.nivel === "medio" ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{r.fator}</div>
                    <div className="text-xs text-muted-foreground">{r.setor}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm">{r.afetados}</div>
                    <div className="text-xs text-muted-foreground">afetados</div>
                  </div>
                  <span className={cn(
                    r.nivel === "alto" ? "orizon-badge-rose" :
                    r.nivel === "medio" ? "orizon-badge-amber" : "orizon-badge-emerald"
                  )}>
                    {r.nivel}
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info("Plano de ação")}>
                    Plano de Ação
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acoes" className="mt-4">
          <div className="space-y-3">
            {acoesPreventivas.map((a, i) => (
              <Card key={i} className="orizon-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    a.status === "ativo" ? "bg-emerald-100" : "bg-amber-100"
                  )}>
                    <Heart className={cn("w-5 h-5", a.status === "ativo" ? "text-emerald-600" : "text-amber-600")} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{a.acao}</div>
                    <div className="text-xs text-muted-foreground">{a.participantes} participantes · Impacto {a.impacto}</div>
                  </div>
                  <span className={cn(a.status === "ativo" ? "orizon-badge-emerald" : "orizon-badge-amber")}>
                    {a.status}
                  </span>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => toast.info("Nova ação preventiva")}>
              <Plus className="w-4 h-4 mr-2" />Adicionar Ação
            </Button>
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
                  <div className="font-bold text-base text-violet-900 mb-2">IA ORIZON — Alertas de Saúde</div>
                  <div className="space-y-2 text-sm text-violet-700">
                    <p>🔴 <strong>Alerta crítico:</strong> 12 colaboradores do setor de Vendas apresentam sinais de sobrecarga. Recomendo redistribuição de carga e 1:1 urgente com gestores.</p>
                    <p>🟡 <strong>Atenção:</strong> Aumento de 15% nos atestados médicos em março. Possível correlação com metas agressivas do Q1.</p>
                    <p>🟢 <strong>Positivo:</strong> Programa de mindfulness reduziu absenteísmo em 8% nos últimos 60 dias.</p>
                  </div>
                  <Button size="sm" className="mt-3 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => toast.success("Relatório NR-1 completo gerado")}>
                    Gerar Relatório NR-1 Completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
