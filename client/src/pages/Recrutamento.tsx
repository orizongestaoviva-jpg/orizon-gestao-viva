/*
 * ORIZON — Gestão Viva
 * Módulo: Recrutamento & Seleção
 * Vagas, candidatos, pipeline, IA, testes
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Plus, Search, Sparkles, Users, Briefcase, Star, Clock,
  MapPin, Link2, QrCode, Share2, Video, FileText, CheckCircle2,
  XCircle, ChevronRight, Filter, TrendingUp, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const vagas = [
  { id: "V001", titulo: "Consultor(a) de Vendas Sênior", dept: "Vendas", local: "São Paulo, SP", tipo: "CLT", candidatos: 28, etapa: "Entrevistas", urgencia: "alta", criada: "02/04/2025" },
  { id: "V002", titulo: "Desenvolvedor(a) Full Stack", dept: "TI", local: "Remoto", tipo: "CLT", candidatos: 45, etapa: "Triagem", urgencia: "media", criada: "05/04/2025" },
  { id: "V003", titulo: "Analista de Marketing Digital", dept: "Marketing", local: "São Paulo, SP", tipo: "CLT", candidatos: 19, etapa: "Testes", urgencia: "baixa", criada: "01/04/2025" },
  { id: "V004", titulo: "Gerente de Projetos", dept: "Operações", local: "Híbrido", tipo: "CLT", candidatos: 12, etapa: "Proposta", urgencia: "alta", criada: "28/03/2025" },
];

const candidatos = [
  { id: 1, nome: "Marcos Oliveira", vaga: "Consultor(a) de Vendas Sênior", score: 94, etapa: "Entrevista Final", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face", cidade: "São Paulo, SP", exp: "7 anos" },
  { id: 2, nome: "Larissa Freitas", vaga: "Consultor(a) de Vendas Sênior", score: 91, etapa: "Entrevista Final", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", cidade: "São Paulo, SP", exp: "5 anos" },
  { id: 3, nome: "Diego Martins", vaga: "Dev Full Stack", score: 88, etapa: "Teste Técnico", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", cidade: "Remoto", exp: "4 anos" },
  { id: 4, nome: "Priscila Nunes", vaga: "Dev Full Stack", score: 85, etapa: "Triagem", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", cidade: "Curitiba, PR", exp: "3 anos" },
  { id: 5, nome: "André Souza", vaga: "Gerente de Projetos", score: 97, etapa: "Proposta Enviada", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", cidade: "São Paulo, SP", exp: "10 anos" },
];

const etapas = ["Inscrição", "Triagem", "Testes", "Entrevista RH", "Entrevista Gestor", "Entrevista Final", "Proposta", "Contratado"];

const urgenciaColors: Record<string, string> = {
  alta: "orizon-badge-rose",
  media: "orizon-badge-amber",
  baixa: "orizon-badge-emerald",
};

export default function Recrutamento() {
  const [tab, setTab] = useState("vagas");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Recrutamento & Seleção</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie vagas, candidatos e pipeline de seleção com IA</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("IA criando vaga...")}>
          <Sparkles className="w-4 h-4 mr-2" />Criar Vaga com IA
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vagas Abertas", value: vagas.length, icon: Briefcase, color: "bg-indigo-600" },
          { label: "Candidatos Ativos", value: candidatos.length + 99, icon: Users, color: "bg-violet-600" },
          { label: "Entrevistas Hoje", value: 6, icon: Video, color: "bg-amber-500" },
          { label: "Contratações (Mês)", value: 3, icon: CheckCircle2, color: "bg-emerald-600" },
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
          <TabsTrigger value="vagas">Vagas</TabsTrigger>
          <TabsTrigger value="candidatos">Candidatos</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="ia">IA & Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="vagas" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar vagas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("Filtros")}>
              <Filter className="w-4 h-4 mr-2" />Filtrar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {vagas.map((v) => (
              <Card key={v.id} className="orizon-card hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => toast.info(`Vaga ${v.id} aberta`)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-base">{v.titulo}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{v.dept} · {v.tipo}</div>
                    </div>
                    <span className={cn(urgenciaColors[v.urgencia])}>
                      {v.urgencia === "alta" ? "Urgente" : v.urgencia === "media" ? "Normal" : "Baixa"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{v.local}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{v.candidatos} candidatos</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Criada em {v.criada}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="orizon-badge-indigo">{v.etapa}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); toast.info("Link copiado!"); }}>
                        <Link2 className="w-3.5 h-3.5 mr-1" />Link
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); toast.info("QR Code gerado"); }}>
                        <QrCode className="w-3.5 h-3.5 mr-1" />QR
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); toast.info("Compartilhado"); }}>
                        <Share2 className="w-3.5 h-3.5 mr-1" />Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidatos" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Candidatos em Processo</CardTitle>
                <Badge variant="outline">{candidatos.length} candidatos</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidatos.map((c) => (
                <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => toast.info(`Perfil de ${c.nome}`)}>
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback>{c.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{c.nome}</div>
                    <div className="text-xs text-muted-foreground">{c.vaga}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{c.cidade}</span>
                      <span className="text-xs text-muted-foreground">· {c.exp} exp.</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                      <span className="font-bold text-sm text-violet-700">{c.score}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Score IA</div>
                  </div>
                  <div className="shrink-0">
                    <span className="orizon-badge-indigo text-[10px]">{c.etapa}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); toast.success(`${c.nome} aprovado(a)`); }}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); toast.error(`${c.nome} reprovado(a)`); }}>
                      <XCircle className="w-4 h-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max">
              {etapas.map((etapa) => {
                const etapaCandidatos = candidatos.filter(c => c.etapa.includes(etapa.split(" ")[0]));
                return (
                  <div key={etapa} className="w-56 shrink-0">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{etapa}</span>
                      <span className="text-xs bg-muted rounded-full px-2 py-0.5 font-semibold">{etapaCandidatos.length}</span>
                    </div>
                    <div className="space-y-2">
                      {etapaCandidatos.map((c) => (
                        <div key={c.id} className="bg-card border border-border rounded-xl p-3 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => toast.info(`Perfil de ${c.nome}`)}>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-7 h-7 shrink-0">
                              <AvatarImage src={c.avatar} />
                              <AvatarFallback className="text-[10px]">{c.nome[0]}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold truncate">{c.nome}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{c.vaga.split(" ").slice(0, 3).join(" ")}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{c.exp} exp.</span>
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-violet-500" />
                              <span className="text-xs font-bold text-violet-700">{c.score}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {etapaCandidatos.length === 0 && (
                        <div className="border-2 border-dashed border-border rounded-xl p-4 text-center text-xs text-muted-foreground">
                          Nenhum candidato
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
                  <div className="font-bold text-base text-violet-900">IA ORIZON — Análise de Candidatos</div>
                  <p className="text-sm text-violet-700 mt-1">
                    Com base nos perfis analisados, <strong>André Souza</strong> tem 97% de compatibilidade com a vaga de Gerente de Projetos. 
                    Recomendo avançar para proposta imediatamente. <strong>Marcos Oliveira</strong> e <strong>Larissa Freitas</strong> são finalistas para Vendas — ambos acima de 90 pontos.
                  </p>
                  <Button size="sm" className="mt-3 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => toast.success("Relatório IA gerado")}>
                    Ver Relatório Completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {candidatos.slice(0, 4).map((c) => (
              <Card key={c.id} className="orizon-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback>{c.nome[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-sm">{c.nome}</div>
                      <div className="text-xs text-muted-foreground">{c.vaga.split(" ").slice(0, 4).join(" ")}</div>
                    </div>
                    <div className="ml-auto text-center">
                      <div className="text-xl font-extrabold text-violet-700">{c.score}</div>
                      <div className="text-[10px] text-muted-foreground">Score IA</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Compatibilidade técnica", value: c.score - 2 },
                      { label: "Fit cultural", value: c.score - 5 },
                      { label: "Potencial de crescimento", value: c.score + 1 > 100 ? 99 : c.score + 1 },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span className="font-semibold">{m.value}%</span>
                        </div>
                        <Progress value={m.value} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
