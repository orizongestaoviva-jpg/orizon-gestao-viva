/*
 * ORIZON — Gestão Viva
 * Módulo: DP Digital
 * Benefícios, atestados, faltas, férias, upload, alertas
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Upload, CheckCircle2, AlertTriangle, Clock,
  Calendar, Heart, DollarSign, Plus, Download, Bell, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const solicitacoes = [
  { id: "S001", tipo: "Férias", colaborador: "Ana Souza", periodo: "15/05 a 29/05/2025", dias: 15, status: "pendente", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" },
  { id: "S002", tipo: "Atestado", colaborador: "Rafael Lima", periodo: "07/04/2025", dias: 1, status: "aprovado", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
  { id: "S003", tipo: "Abono de Falta", colaborador: "Camila Rocha", periodo: "03/04/2025", dias: 1, status: "pendente", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" },
  { id: "S004", tipo: "Férias", colaborador: "Carlos Mendes", periodo: "01/07 a 30/07/2025", dias: 30, status: "aprovado", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  { id: "S005", tipo: "Licença Médica", colaborador: "Thiago Alves", periodo: "01/04 a 15/04/2025", dias: 15, status: "aprovado", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face" },
];

const beneficios = [
  { nome: "Vale Refeição", valor: "R$ 35,00/dia", colaboradores: 154, status: "ativo" },
  { nome: "Vale Transporte", valor: "Conforme trajeto", colaboradores: 128, status: "ativo" },
  { nome: "Plano de Saúde", valor: "Bradesco Saúde", colaboradores: 154, status: "ativo" },
  { nome: "Plano Odontológico", valor: "Odontoprev", colaboradores: 120, status: "ativo" },
  { nome: "Gympass", valor: "R$ 99,90/mês", colaboradores: 45, status: "ativo" },
  { nome: "Seguro de Vida", valor: "Cobertura R$ 100k", colaboradores: 154, status: "ativo" },
];

const alertas = [
  { tipo: "warning", msg: "8 colaboradores com férias vencendo em 30 dias", acao: "Ver lista" },
  { tipo: "error", msg: "3 atestados aguardando aprovação há mais de 48h", acao: "Aprovar" },
  { tipo: "info", msg: "Folha de pagamento fecha em 5 dias (15/04/2025)", acao: "Preparar" },
  { tipo: "success", msg: "Benefícios de Abril enviados para todos os colaboradores", acao: "Ver detalhes" },
];

export default function DPDigital() {
  const [tab, setTab] = useState("solicitacoes");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">DP Digital</h1>
          <p className="text-muted-foreground text-sm mt-1">Benefícios, férias, atestados, faltas e alertas automáticos</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.info("Nova solicitação")}>
          <Plus className="w-4 h-4 mr-2" />Nova Solicitação
        </Button>
      </div>

      {/* Alertas */}
      <div className="space-y-2">
        {alertas.map((a, i) => (
          <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl border",
            a.tipo === "warning" ? "bg-amber-50 border-amber-200" :
            a.tipo === "error" ? "bg-rose-50 border-rose-200" :
            a.tipo === "info" ? "bg-indigo-50 border-indigo-200" : "bg-emerald-50 border-emerald-200"
          )}>
            <Bell className={cn("w-4 h-4 shrink-0",
              a.tipo === "warning" ? "text-amber-600" :
              a.tipo === "error" ? "text-rose-600" :
              a.tipo === "info" ? "text-indigo-600" : "text-emerald-600"
            )} />
            <span className="text-sm flex-1">{a.msg}</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => toast.info(a.acao)}>
              {a.acao}
            </Button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Férias Pendentes", value: 8, icon: Calendar, color: "bg-amber-500" },
          { label: "Atestados (Mês)", value: 12, icon: FileText, color: "bg-indigo-600" },
          { label: "Faltas Justificadas", value: 5, icon: CheckCircle2, color: "bg-emerald-600" },
          { label: "Faltas Injustificadas", value: 2, icon: AlertTriangle, color: "bg-rose-500" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="orizon-card">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold tabular-nums">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
          <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
          <TabsTrigger value="ferias">Férias</TabsTrigger>
          <TabsTrigger value="folha">Folha de Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="solicitacoes" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Solicitações em Aberto</CardTitle>
                <Button variant="outline" size="sm" onClick={() => toast.info("Filtros")}>
                  <Filter className="w-4 h-4 mr-2" />Filtrar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {solicitacoes.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={s.avatar} />
                    <AvatarFallback>{s.colaborador[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{s.colaborador}</div>
                    <div className="text-xs text-muted-foreground">{s.tipo} · {s.periodo} · {s.dias} dia(s)</div>
                  </div>
                  <span className={cn(
                    s.status === "aprovado" ? "orizon-badge-emerald" :
                    s.status === "reprovado" ? "orizon-badge-rose" : "orizon-badge-amber"
                  )}>
                    {s.status}
                  </span>
                  {s.status === "pendente" && (
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600" onClick={() => toast.success("Aprovado!")}>Aprovar</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-rose-500" onClick={() => toast.error("Reprovado")}>Reprovar</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beneficios" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {beneficios.map((b, i) => (
              <Card key={i} className="orizon-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{b.nome}</div>
                    <div className="text-xs text-muted-foreground">{b.valor} · {b.colaboradores} colaboradores</div>
                  </div>
                  <span className="orizon-badge-emerald">{b.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => toast.info("Adicionar benefício")}>
            <Plus className="w-4 h-4 mr-2" />Adicionar Benefício
          </Button>
        </TabsContent>

        <TabsContent value="ferias" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Controle de Férias — CLT Art. 129</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nome: "Ana Souza", admissao: "15/03/2022", periodo: "15/03/2024 – 14/03/2025", saldo: 30, agendado: 15, vencimento: "14/03/2026" },
                  { nome: "Carlos Mendes", admissao: "01/08/2019", periodo: "01/08/2024 – 31/07/2025", saldo: 30, agendado: 30, vencimento: "31/07/2026" },
                  { nome: "Lucas Ferreira", admissao: "22/06/2021", periodo: "22/06/2024 – 21/06/2025", saldo: 30, agendado: 0, vencimento: "21/06/2026" },
                ].map((f, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-sm">{f.nome}</div>
                        <div className="text-xs text-muted-foreground">Período aquisitivo: {f.periodo}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{f.saldo - f.agendado} dias disponíveis</div>
                        <div className="text-xs text-muted-foreground">Vence: {f.vencimento}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Agendado: {f.agendado} dias</span>
                      <span className="text-muted-foreground">·</span>
                      <span className={cn("font-semibold", f.agendado === 0 ? "text-amber-600" : "text-emerald-600")}>
                        {f.agendado === 0 ? "⚠ Não agendado" : "✓ Agendado"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-xs font-bold text-indigo-700 mb-1">📋 CLT — Férias</div>
                <p className="text-xs text-indigo-600">Férias devem ser concedidas em até 12 meses após o período aquisitivo (CLT Art. 134). O colaborador pode dividir em até 3 períodos, sendo um deles de no mínimo 14 dias corridos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folha" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Folha de Pagamento — Abril 2025</CardTitle>
                <Button variant="outline" size="sm" onClick={() => toast.info("Exportar folha")}>
                  <Download className="w-4 h-4 mr-2" />Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Total Bruto", value: "R$ 892.400" },
                  { label: "INSS (20%)", value: "R$ 178.480" },
                  { label: "FGTS (8%)", value: "R$ 71.392" },
                  { label: "Total Líquido", value: "R$ 642.528" },
                ].map((f) => (
                  <div key={f.label} className="p-3 bg-muted/30 rounded-xl text-center">
                    <div className="font-bold text-base tabular-nums">{f.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{f.label}</div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="text-xs font-bold text-emerald-700 mb-1">✓ Status da Folha</div>
                <p className="text-xs text-emerald-600">Folha em processamento. Fechamento previsto para 15/04/2025. Pagamento: 20/04/2025 (conforme convenção coletiva).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
