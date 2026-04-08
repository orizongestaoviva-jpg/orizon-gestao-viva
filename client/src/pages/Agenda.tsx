/*
 * ORIZON — Gestão Viva
 * Módulo: Agenda & Kanban
 * Calendário, tarefas, Kanban de projetos
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, Plus, Clock, Users, Video, MapPin,
  ChevronLeft, ChevronRight, MoreHorizontal, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const eventos = [
  { id: 1, titulo: "Reunião de Vendas Semanal", hora: "09:00", duracao: "1h", tipo: "reuniao", participantes: 8, local: "Sala A / Google Meet", dia: 8 },
  { id: 2, titulo: "1:1 Ana Souza × Carlos Mendes", hora: "10:00", duracao: "30min", tipo: "11", participantes: 2, local: "Google Meet", dia: 8 },
  { id: 3, titulo: "Entrevista — Marcos Oliveira (Vendas)", hora: "14:00", duracao: "1h", tipo: "entrevista", participantes: 3, local: "Google Meet", dia: 8 },
  { id: 4, titulo: "Treinamento Liderança", hora: "15:30", duracao: "2h", tipo: "treinamento", participantes: 15, local: "Auditório", dia: 9 },
  { id: 5, titulo: "All Hands — Resultados Q1", hora: "10:00", duracao: "1h30", tipo: "allhands", participantes: 154, local: "Google Meet", dia: 10 },
  { id: 6, titulo: "Revisão de OKRs Q2", hora: "14:00", duracao: "2h", tipo: "reuniao", participantes: 12, local: "Sala B", dia: 11 },
];

const kanbanColunas = [
  {
    id: "backlog", titulo: "Backlog", cor: "bg-muted",
    tarefas: [
      { id: 1, titulo: "Criar política de home office", prioridade: "media", responsavel: "Carlos", prazo: "30/04" },
      { id: 2, titulo: "Revisar plano de cargos e salários", prioridade: "alta", responsavel: "Fernanda", prazo: "15/05" },
    ]
  },
  {
    id: "em_andamento", titulo: "Em Andamento", cor: "bg-amber-50",
    tarefas: [
      { id: 3, titulo: "Implementar avaliação 360°", prioridade: "alta", responsavel: "Carlos", prazo: "15/04" },
      { id: 4, titulo: "Pesquisa de clima Q2", prioridade: "media", responsavel: "Ana", prazo: "20/04" },
      { id: 5, titulo: "Onboarding Juliana Costa", prioridade: "alta", responsavel: "Carlos", prazo: "30/04" },
    ]
  },
  {
    id: "revisao", titulo: "Em Revisão", cor: "bg-indigo-50",
    tarefas: [
      { id: 6, titulo: "Política de férias atualizada", prioridade: "baixa", responsavel: "Fernanda", prazo: "10/04" },
    ]
  },
  {
    id: "concluido", titulo: "Concluído", cor: "bg-emerald-50",
    tarefas: [
      { id: 7, titulo: "Folha de pagamento Março", prioridade: "alta", responsavel: "Carlos", prazo: "05/04" },
      { id: 8, titulo: "Relatório de turnover Q1", prioridade: "media", responsavel: "Ana", prazo: "07/04" },
    ]
  },
];

const prioridadeColors: Record<string, string> = {
  alta: "orizon-badge-rose",
  media: "orizon-badge-amber",
  baixa: "orizon-badge-emerald",
};

const tipoEventoColors: Record<string, string> = {
  reuniao: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "11": "bg-violet-100 text-violet-700 border-violet-200",
  entrevista: "bg-amber-100 text-amber-700 border-amber-200",
  treinamento: "bg-emerald-100 text-emerald-700 border-emerald-200",
  allhands: "bg-rose-100 text-rose-700 border-rose-200",
};

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);

export default function Agenda() {
  const [tab, setTab] = useState("agenda");
  const [diaAtivo, setDiaAtivo] = useState(8);

  const eventosDia = eventos.filter(e => e.dia === diaAtivo);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Agenda & Kanban</h1>
          <p className="text-muted-foreground text-sm mt-1">Calendário de eventos, reuniões e gestão de tarefas</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.info("Novo evento criado")}>
          <Plus className="w-4 h-4 mr-2" />Novo Evento
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Mini Calendar */}
            <Card className="orizon-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Abril 2025</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {diasSemana.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Offset for April (starts Tuesday) */}
                  {[0, 1].map(i => <div key={`empty-${i}`} />)}
                  {diasMes.map(dia => {
                    const temEvento = eventos.some(e => e.dia === dia);
                    return (
                      <button
                        key={dia}
                        onClick={() => setDiaAtivo(dia)}
                        className={cn(
                          "h-8 w-full rounded-lg text-xs font-medium transition-colors",
                          diaAtivo === dia ? "orizon-gradient text-white" :
                          temEvento ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" :
                          "hover:bg-muted text-foreground"
                        )}
                      >
                        {dia}
                        {temEvento && diaAtivo !== dia && (
                          <div className="w-1 h-1 bg-indigo-500 rounded-full mx-auto mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Events of selected day */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">
                  {diaAtivo === 8 ? "Hoje" : `Dia ${diaAtivo}`} — {eventosDia.length} evento(s)
                </h3>
              </div>
              {eventosDia.length === 0 ? (
                <Card className="orizon-card">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhum evento neste dia</p>
                  </CardContent>
                </Card>
              ) : (
                eventosDia.map((e) => (
                  <Card key={e.id} className={cn("orizon-card cursor-pointer hover:shadow-md transition-all border", tipoEventoColors[e.tipo])} onClick={() => toast.info(e.titulo)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-center shrink-0 w-12">
                          <div className="font-bold text-base">{e.hora}</div>
                          <div className="text-[10px] text-muted-foreground">{e.duracao}</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{e.titulo}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.local}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{e.participantes}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={(ev) => { ev.stopPropagation(); toast.info("Entrando na reunião..."); }}>
                          <Video className="w-3.5 h-3.5 mr-1" />Entrar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {kanbanColunas.map((col) => (
                <div key={col.id} className="w-64 shrink-0">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{col.titulo}</span>
                    <span className="text-xs bg-muted rounded-full px-2 py-0.5 font-semibold">{col.tarefas.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.tarefas.map((tarefa) => (
                      <Card key={tarefa.id} className={cn("orizon-card cursor-pointer hover:shadow-md transition-all", col.cor)} onClick={() => toast.info(tarefa.titulo)}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-xs font-semibold leading-snug">{tarefa.titulo}</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 shrink-0" onClick={(e) => { e.stopPropagation(); }}>
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={cn(prioridadeColors[tarefa.prioridade], "text-[10px]")}>{tarefa.prioridade}</span>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="w-3 h-3" />{tarefa.prazo}
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-muted-foreground">{tarefa.responsavel}</div>
                        </CardContent>
                      </Card>
                    ))}
                    <button
                      className="w-full p-2 rounded-xl border-2 border-dashed border-border text-xs text-muted-foreground hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
                      onClick={() => toast.info("Nova tarefa")}
                    >
                      <Plus className="w-3.5 h-3.5" />Adicionar tarefa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
