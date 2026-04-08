/*
 * ORIZON — Gestão Viva
 * Módulo: Onboarding
 * Checklist por área, metas iniciais, acompanhamento 90 dias, trilhas
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2, Circle, Clock, Users, BookOpen, Target,
  Plus, ChevronRight, Sparkles, Calendar, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const novosColaboradores = [
  { id: 1, nome: "Juliana Costa", cargo: "Analista de Vendas", dept: "Vendas", admissao: "01/04/2025", diasNaEmpresa: 7, progresso: 35, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" },
  { id: 2, nome: "Pedro Alves", cargo: "Dev Backend", dept: "TI", admissao: "24/03/2025", diasNaEmpresa: 15, progresso: 62, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
  { id: 3, nome: "Mariana Ferreira", cargo: "Analista de RH", dept: "RH", admissao: "10/03/2025", diasNaEmpresa: 29, progresso: 85, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face" },
];

const checklistItems = [
  { id: 1, categoria: "Documentação", item: "Assinar contrato de trabalho", concluido: true, responsavel: "RH" },
  { id: 2, categoria: "Documentação", item: "Assinar termo LGPD", concluido: true, responsavel: "RH" },
  { id: 3, categoria: "Documentação", item: "Exame admissional realizado", concluido: true, responsavel: "RH" },
  { id: 4, categoria: "Acesso", item: "Criar e-mail corporativo", concluido: true, responsavel: "TI" },
  { id: 5, categoria: "Acesso", item: "Configurar computador/equipamentos", concluido: true, responsavel: "TI" },
  { id: 6, categoria: "Acesso", item: "Acesso ao ORIZON liberado", concluido: true, responsavel: "TI" },
  { id: 7, categoria: "Integração", item: "Tour pela empresa/apresentações", concluido: true, responsavel: "Gestor" },
  { id: 8, categoria: "Integração", item: "Reunião com equipe direta", concluido: true, responsavel: "Gestor" },
  { id: 9, categoria: "Treinamento", item: "Trilha de onboarding geral", concluido: false, responsavel: "RH" },
  { id: 10, categoria: "Treinamento", item: "Treinamento do produto/serviço", concluido: false, responsavel: "Gestor" },
  { id: 11, categoria: "Metas", item: "Definir metas dos primeiros 30 dias", concluido: false, responsavel: "Gestor" },
  { id: 12, categoria: "Metas", item: "PDI inicial criado", concluido: false, responsavel: "RH" },
];

export default function Onboarding() {
  const [tab, setTab] = useState("ativos");
  const [checklist, setChecklist] = useState(checklistItems);

  const toggleItem = (id: number) => {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, concluido: !i.concluido } : i));
    toast.success("Item atualizado!");
  };

  const concluidos = checklist.filter(i => i.concluido).length;
  const progresso = Math.round(concluidos / checklist.length * 100);

  const categorias = Array.from(new Set(checklist.map(i => i.categoria)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Onboarding</h1>
          <p className="text-muted-foreground text-sm mt-1">Integração estruturada com acompanhamento de 90 dias</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.info("Novo onboarding iniciado")}>
          <Plus className="w-4 h-4 mr-2" />Iniciar Onboarding
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {novosColaboradores.map((c) => (
          <Card key={c.id} className="orizon-card cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => toast.info(`Onboarding de ${c.nome}`)}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{c.nome[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-sm">{c.nome}</div>
                  <div className="text-xs text-muted-foreground">{c.cargo} · {c.dept}</div>
                  <div className="text-xs text-muted-foreground">Admissão: {c.admissao}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progresso do onboarding</span>
                  <span className="font-bold">{c.progresso}%</span>
                </div>
                <Progress value={c.progresso} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.diasNaEmpresa} dias na empresa</span>
                  <span>{90 - c.diasNaEmpresa} dias restantes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="ativos">Em Andamento</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="trilhas">Trilhas Iniciais</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Checklist de Onboarding</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{concluidos}/{checklist.length}</span>
                  <Progress value={progresso} className="w-24 h-2" />
                  <span className="text-sm font-bold">{progresso}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorias.map((cat) => (
                <div key={cat}>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{cat}</div>
                  <div className="space-y-2">
                    {checklist.filter(i => i.categoria === cat).map((item) => (
                      <div
                        key={item.id}
                        className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors", item.concluido ? "bg-emerald-50 border-emerald-200" : "bg-background border-border hover:bg-muted/30")}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.concluido ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                        <span className={cn("text-sm flex-1", item.concluido && "line-through text-muted-foreground")}>{item.item}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{item.responsavel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ativos" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { fase: "Primeiros 30 dias", desc: "Integração, documentação e primeiros treinamentos", cor: "bg-indigo-100 text-indigo-700", icon: "🚀" },
              { fase: "30 a 60 dias", desc: "Aprofundamento técnico, metas e feedbacks iniciais", cor: "bg-violet-100 text-violet-700", icon: "📈" },
              { fase: "60 a 90 dias", desc: "Avaliação de desempenho, PDI e integração completa", cor: "bg-amber-100 text-amber-700", icon: "🎯" },
            ].map((f) => (
              <Card key={f.fase} className="orizon-card">
                <CardContent className="p-5">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className={cn("text-sm font-bold px-2 py-1 rounded-lg inline-block mb-2", f.cor)}>{f.fase}</div>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info("Detalhes da fase")}>
                    Ver tarefas <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trilhas" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { titulo: "Cultura e Valores ORIZON", modulos: 4, duracao: "2h", obrigatorio: true, progresso: 100 },
              { titulo: "Compliance e LGPD", modulos: 3, duracao: "1h30", obrigatorio: true, progresso: 75 },
              { titulo: "Ferramentas e Sistemas", modulos: 6, duracao: "3h", obrigatorio: true, progresso: 50 },
              { titulo: "Segurança do Trabalho (NR-1)", modulos: 5, duracao: "2h30", obrigatorio: true, progresso: 0 },
            ].map((t, i) => (
              <Card key={i} className="orizon-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-sm">{t.titulo}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.modulos} módulos · {t.duracao}</div>
                    </div>
                    {t.obrigatorio && <span className="orizon-badge-rose text-[10px]">Obrigatório</span>}
                  </div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold">{t.progresso}%</span>
                  </div>
                  <Progress value={t.progresso} className="h-2 mb-3" />
                  <Button
                    size="sm"
                    className={cn("w-full text-xs", t.progresso === 100 ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "orizon-gradient text-white")}
                    onClick={() => toast.info(t.progresso === 100 ? "Trilha concluída!" : "Iniciando trilha...")}
                  >
                    {t.progresso === 100 ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Concluído</> : t.progresso > 0 ? "Continuar" : "Iniciar Trilha"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
