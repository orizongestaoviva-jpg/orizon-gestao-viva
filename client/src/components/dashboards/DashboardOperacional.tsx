/**
 * ORIZON — Gestão Viva
 * Dashboard Operacional: Foco em tarefas do dia a dia, ponto e notificações pessoais
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Clock, CheckCircle2, AlertCircle, Calendar, Target,
  ArrowUpRight, Zap, Heart, Award, Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const tarefasHoje = [
  { id: 1, title: "Registrar ponto de entrada", completed: true, priority: "normal", time: "08:00" },
  { id: 2, title: "Revisar proposta do cliente XYZ", completed: false, priority: "high", time: "10:30" },
  { id: 3, title: "Participar de reunião de alinhamento", completed: false, priority: "high", time: "14:00" },
  { id: 4, title: "Enviar relatório de atividades", completed: false, priority: "normal", time: "17:00" },
  { id: 5, title: "Registrar ponto de saída", completed: false, priority: "normal", time: "18:00" },
];

const minhasMetas = [
  { title: "Meta de Vendas (Abril)", current: 18500, target: 20000, unit: "R$", progress: 92 },
  { title: "Clientes Novos", current: 12, target: 15, unit: "clientes", progress: 80 },
  { title: "Taxa de Conversão", current: 34, target: 40, unit: "%", progress: 85 },
];

const notificacoes = [
  { id: 1, title: "Reunião com gestor em 30 min", type: "meeting", time: "há 5 min" },
  { id: 2, title: "Seu treinamento começa amanhã", type: "training", time: "há 2h" },
  { id: 3, title: "Feedback 360° disponível para responder", type: "feedback", time: "há 4h" },
  { id: 4, title: "Parabéns! Você foi reconhecido no feed", type: "recognition", time: "há 1 dia" },
];

export default function DashboardOperacional() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">Bom dia, Ana 👋</h1>
        <p className="text-sm text-muted-foreground">
          quarta-feira, 8 de abril de 2026 · Consultora de Vendas · Vendas
        </p>
      </div>

      {/* KPIs Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">+2</Badge>
            </div>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground mt-1">Tarefas concluídas hoje</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <Badge variant="outline" className="text-amber-700 border-amber-300">Hoje</Badge>
            </div>
            <div className="text-2xl font-bold text-foreground">8h 42m</div>
            <p className="text-xs text-muted-foreground mt-1">Horas trabalhadas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <Badge variant="outline" className="text-indigo-700 border-indigo-300">92%</Badge>
            </div>
            <div className="text-2xl font-bold text-foreground">R$ 18.5k</div>
            <p className="text-xs text-muted-foreground mt-1">Vendas do mês</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-violet-600" />
              </div>
              <Badge variant="outline" className="text-violet-700 border-violet-300">+1</Badge>
            </div>
            <div className="text-2xl font-bold text-foreground">94</div>
            <p className="text-xs text-muted-foreground mt-1">Score de performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarefas do Dia */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Tarefas de Hoje</h2>
            <Button variant="outline" size="sm">+ Nova tarefa</Button>
          </div>

          <div className="space-y-2">
            {tarefasHoje.map((tarefa) => (
              <div
                key={tarefa.id}
                className={cn(
                  "p-4 rounded-lg border transition-all cursor-pointer hover:bg-accent/50",
                  tarefa.completed ? "bg-muted/50 border-border" : "bg-card border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded border mt-0.5 flex items-center justify-center flex-shrink-0",
                    tarefa.completed ? "bg-emerald-500 border-emerald-500" : "border-border"
                  )}>
                    {tarefa.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium",
                      tarefa.completed && "line-through text-muted-foreground"
                    )}>
                      {tarefa.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{tarefa.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      tarefa.priority === "high" ? "bg-rose-50 text-rose-700 border-rose-300" : "bg-amber-50 text-amber-700 border-amber-300"
                    )}
                  >
                    {tarefa.priority === "high" ? "Urgente" : "Normal"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notificações */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Notificações</h2>

          <div className="space-y-2">
            {notificacoes.map((notif) => (
              <div key={notif.id} className="p-3 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Minhas Metas */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Minhas Metas (Abril)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {minhasMetas.map((meta, idx) => (
            <Card key={idx}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{meta.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {meta.current} / {meta.target} {meta.unit}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">{meta.progress}%</span>
                </div>
                <Progress value={meta.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dica do Dia */}
      <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Dica do Dia</p>
              <p className="text-sm text-muted-foreground mt-1">
                Você está 92% da meta de vendas! Mais 2 propostas e você atinge 100% em abril. Continue assim! 🚀
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
