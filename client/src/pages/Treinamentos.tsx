/*
 * ORIZON — Gestão Viva
 * Módulo: Treinamentos & Desenvolvimento
 * Trilhas por setor, progresso, PDI, sugestão IA
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  GraduationCap, Play, Clock, Users, Star, Sparkles,
  Plus, Search, Filter, BookOpen, Video, FileText, Award, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AI_BRAIN_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530315430/343ixLiM8FyvzGoB2fCnzG/orizon-ai-brain-G4Et8aRCiCTpmtr38jas3E.webp";

const trilhas = [
  { id: 1, titulo: "Vendas Consultivas Avançadas", setor: "Vendas", modulos: 8, duracao: "12h", nivel: "Avançado", inscritos: 24, progresso: 65, tipo: "video", destaque: true },
  { id: 2, titulo: "Liderança e Gestão de Equipes", setor: "Gestão", modulos: 6, duracao: "9h", nivel: "Intermediário", inscritos: 15, progresso: 40, tipo: "misto", destaque: false },
  { id: 3, titulo: "Excel e Power BI para RH", setor: "RH", modulos: 10, duracao: "15h", nivel: "Básico", inscritos: 32, progresso: 80, tipo: "pratico", destaque: false },
  { id: 4, titulo: "Compliance e LGPD", setor: "Todos", modulos: 4, duracao: "5h", nivel: "Básico", inscritos: 154, progresso: 92, tipo: "video", destaque: false },
  { id: 5, titulo: "Comunicação Não-Violenta", setor: "Todos", modulos: 5, duracao: "7h", nivel: "Básico", inscritos: 48, progresso: 55, tipo: "misto", destaque: true },
  { id: 6, titulo: "Desenvolvimento em React", setor: "TI", modulos: 12, duracao: "20h", nivel: "Avançado", inscritos: 8, progresso: 30, tipo: "pratico", destaque: false },
];

const nivelColors: Record<string, string> = {
  "Básico": "orizon-badge-emerald",
  "Intermediário": "orizon-badge-amber",
  "Avançado": "orizon-badge-violet",
};

const tipoIcons: Record<string, React.ElementType> = {
  video: Video,
  misto: BookOpen,
  pratico: FileText,
};

export default function Treinamentos() {
  const [tab, setTab] = useState("trilhas");
  const [search, setSearch] = useState("");

  const filtered = trilhas.filter(t =>
    t.titulo.toLowerCase().includes(search.toLowerCase()) ||
    t.setor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Treinamentos & Desenvolvimento</h1>
          <p className="text-muted-foreground text-sm mt-1">Trilhas por setor, PDI e sugestões personalizadas por IA</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("IA gerando trilha personalizada...")}>
            <Sparkles className="w-4 h-4 mr-2" />Criar com IA
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Nova trilha manual")}>
            <Plus className="w-4 h-4 mr-2" />Nova Trilha
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Trilhas Ativas", value: trilhas.length, icon: GraduationCap, color: "bg-indigo-600" },
          { label: "Horas de Conteúdo", value: "68h", icon: Clock, color: "bg-violet-600" },
          { label: "Colaboradores Treinando", value: 89, icon: Users, color: "bg-amber-500" },
          { label: "Conclusões (Mês)", value: 34, icon: Award, color: "bg-emerald-600" },
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

      {/* IA Suggestion Banner */}
      <Card className="orizon-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              <span className="font-bold text-base text-violet-900">Sugestão IA para você</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Com base no seu perfil e PDI, a IA recomenda a trilha <strong>"Vendas Consultivas Avançadas"</strong>. 
              Ela aumenta em média 23% o ticket médio dos vendedores que a concluem.
            </p>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white" size="sm" onClick={() => toast.success("Inscrito na trilha!")}>
              <Play className="w-4 h-4 mr-2" />Começar Agora
            </Button>
          </div>
          <div className="w-full md:w-40 h-32 md:h-auto overflow-hidden">
            <img src={AI_BRAIN_IMG} alt="IA" className="w-full h-full object-cover opacity-60" />
          </div>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="trilhas">Trilhas</TabsTrigger>
          <TabsTrigger value="meu-progresso">Meu Progresso</TabsTrigger>
          <TabsTrigger value="pdi">PDI</TabsTrigger>
        </TabsList>

        <TabsContent value="trilhas" className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar trilhas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => {
              const TipoIcon = tipoIcons[t.tipo];
              return (
                <Card key={t.id} className={cn("orizon-card cursor-pointer hover:border-indigo-300 transition-all hover:shadow-md", t.destaque && "border-violet-300 ring-1 ring-violet-200")}>
                  <CardContent className="p-5">
                    {t.destaque && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-600">Destaque</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-sm leading-snug">{t.titulo}</div>
                      <TipoIcon className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="orizon-badge-indigo text-[10px]">{t.setor}</span>
                      <span className={cn(nivelColors[t.nivel], "text-[10px]")}>{t.nivel}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{t.modulos} módulos</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.duracao}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{t.inscritos}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-muted-foreground">Progresso médio</span>
                      <span className="font-bold">{t.progresso}%</span>
                    </div>
                    <Progress value={t.progresso} className="h-1.5 mb-3" />
                    <Button size="sm" className="w-full orizon-gradient text-white text-xs" onClick={() => toast.info(`Abrindo: ${t.titulo}`)}>
                      <Play className="w-3.5 h-3.5 mr-1.5" />Acessar Trilha
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="meu-progresso" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {trilhas.slice(0, 4).map((t) => (
              <Card key={t.id} className="orizon-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-sm">{t.titulo}</div>
                    <span className={cn(nivelColors[t.nivel], "text-[10px]")}>{t.nivel}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-muted-foreground">{t.modulos} módulos · {t.duracao}</span>
                    <span className="font-bold">{t.progresso}%</span>
                  </div>
                  <Progress value={t.progresso} className="h-2 mb-3" />
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => toast.info("Continuando trilha...")}>
                    {t.progresso === 100 ? "✓ Concluído" : t.progresso > 0 ? "Continuar" : "Iniciar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pdi" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">PDI — Plano de Desenvolvimento Individual</CardTitle>
                <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.success("IA gerando PDI...")}>
                  <Sparkles className="w-4 h-4 mr-2" />Gerar com IA
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { meta: "Certificação em Vendas Consultivas", prazo: "Jun/2025", progresso: 65, categoria: "Técnico", impacto: "Alto" },
                { meta: "Curso de Liderança e Gestão", prazo: "Set/2025", progresso: 30, categoria: "Comportamental", impacto: "Alto" },
                { meta: "Inglês Avançado (B2)", prazo: "Dez/2025", progresso: 45, categoria: "Idioma", impacto: "Médio" },
                { meta: "Mentoria com Diretor Comercial", prazo: "Ago/2025", progresso: 80, categoria: "Mentoria", impacto: "Alto" },
              ].map((p, i) => (
                <div key={i} className="p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">{p.meta}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="orizon-badge-indigo text-[10px]">{p.categoria}</span>
                        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", p.impacto === "Alto" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>
                          Impacto {p.impacto}
                        </span>
                        <span className="text-xs text-muted-foreground">Prazo: {p.prazo}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{p.progresso}%</span>
                  </div>
                  <Progress value={p.progresso} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
