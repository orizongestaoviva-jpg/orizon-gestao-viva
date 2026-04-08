/*
 * ORIZON — Gestão Viva
 * Módulo: Colaboradores — Jornada Completa
 * Ficha completa, histórico, PDI, documentos, carreira
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
  Search, Plus, Filter, Download, User, Briefcase, FileText,
  GraduationCap, TrendingUp, Heart, Clock, Star, MapPin,
  Phone, Mail, Calendar, ChevronRight, Award, Target, Edit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const colaboradores = [
  { id: 1, name: "Ana Souza", cargo: "Consultora de Vendas", dept: "Vendas", status: "ativo", admissao: "15/03/2022", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face", score: 92, cidade: "São Paulo, SP" },
  { id: 2, name: "Carlos Mendes", cargo: "Gerente de RH", dept: "RH", status: "ativo", admissao: "01/08/2019", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", score: 88, cidade: "São Paulo, SP" },
  { id: 3, name: "Fernanda Lima", cargo: "Diretora de Pessoas", dept: "Diretoria", status: "ativo", admissao: "10/01/2018", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face", score: 96, cidade: "São Paulo, SP" },
  { id: 4, name: "Lucas Ferreira", cargo: "Consultor Sênior", dept: "Vendas", status: "ativo", admissao: "22/06/2021", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face", score: 98, cidade: "Rio de Janeiro, RJ" },
  { id: 5, name: "Beatriz Santos", cargo: "Analista de Marketing", dept: "Marketing", status: "ativo", admissao: "05/11/2022", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face", score: 85, cidade: "Belo Horizonte, MG" },
  { id: 6, name: "Rafael Lima", cargo: "Dev Full Stack", dept: "TI", status: "ferias", admissao: "14/02/2020", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face", score: 90, cidade: "Curitiba, PR" },
  { id: 7, name: "Camila Rocha", cargo: "Analista Financeiro", dept: "Financeiro", status: "ativo", admissao: "30/09/2021", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face", score: 87, cidade: "São Paulo, SP" },
  { id: 8, name: "Thiago Alves", cargo: "Coordenador de Ops", dept: "Operações", status: "afastado", admissao: "07/04/2019", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&crop=face", score: 79, cidade: "São Paulo, SP" },
];

const statusColors: Record<string, string> = {
  ativo: "orizon-badge-emerald",
  ferias: "orizon-badge-amber",
  afastado: "orizon-badge-rose",
  desligado: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  ativo: "Ativo",
  ferias: "Férias",
  afastado: "Afastado",
  desligado: "Desligado",
};

function ColaboradorDetalhe({ colab, onClose }: { colab: typeof colaboradores[0]; onClose: () => void }) {
  const [tab, setTab] = useState("perfil");
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="orizon-gradient p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white/30">
                <AvatarImage src={colab.avatar} />
                <AvatarFallback className="text-xl font-bold bg-indigo-700">{colab.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-extrabold">{colab.name}</h2>
                <div className="text-white/80 text-sm">{colab.cargo} · {colab.dept}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white")}>
                    {statusLabels[colab.status]}
                  </span>
                  <span className="text-white/60 text-xs">Desde {colab.admissao}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => toast.info("Editar colaborador")}>
                <Edit className="w-4 h-4" />
              </Button>
              <button onClick={onClose} className="text-white/70 hover:text-white text-xl font-bold">×</button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{colab.cidade}</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{colab.name.toLowerCase().replace(" ", ".")}@empresa.com.br</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-300" />{colab.score} pts</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mx-4 mt-3 bg-muted shrink-0">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="carreira">Carreira</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="pdi">PDI</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="perfil" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "CPF", value: "***.***.***-**" },
                  { label: "RG", value: "**.***.***-*" },
                  { label: "Data de Nascimento", value: "15/06/1992" },
                  { label: "Estado Civil", value: "Casado(a)" },
                  { label: "PIS/PASEP", value: "***.***.***-*" },
                  { label: "CTPS", value: "*****/***-*" },
                  { label: "Banco", value: "Bradesco — Ag. 1234 / CC 56789-0" },
                  { label: "Endereço", value: "Rua das Flores, 123 — São Paulo, SP" },
                ].map((f) => (
                  <div key={f.label} className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground font-medium">{f.label}</div>
                    <div className="text-sm font-semibold mt-0.5">{f.value}</div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-xs font-bold text-indigo-700 mb-1">🔒 LGPD — Dados Protegidos</div>
                <p className="text-xs text-indigo-600">Dados pessoais protegidos conforme Lei 13.709/2018. Acesso restrito por nível de permissão.</p>
              </div>
            </TabsContent>

            <TabsContent value="carreira" className="space-y-3 mt-0">
              {[
                { cargo: colab.cargo, dept: colab.dept, inicio: colab.admissao, fim: "Atual", salario: "R$ 8.500,00", tipo: "atual" },
                { cargo: "Analista Júnior", dept: colab.dept, inicio: "01/01/2021", fim: "14/03/2022", salario: "R$ 5.200,00", tipo: "anterior" },
                { cargo: "Estagiário", dept: colab.dept, inicio: "15/06/2020", fim: "31/12/2020", salario: "R$ 1.800,00", tipo: "anterior" },
              ].map((c, i) => (
                <div key={i} className={cn("p-4 rounded-xl border", c.tipo === "atual" ? "bg-indigo-50 border-indigo-200" : "bg-muted/20 border-border")}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm">{c.cargo}</div>
                      <div className="text-xs text-muted-foreground">{c.dept} · {c.inicio} → {c.fim}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-emerald-600">{c.salario}</div>
                      {c.tipo === "atual" && <span className="orizon-badge-emerald text-[10px]">Atual</span>}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="documentos" className="space-y-2 mt-0">
              {[
                { nome: "Contrato de Trabalho", tipo: "PDF", data: "15/03/2022", status: "vigente" },
                { nome: "Termo LGPD", tipo: "PDF", data: "15/03/2022", status: "assinado" },
                { nome: "Exame Admissional", tipo: "PDF", data: "14/03/2022", status: "ok" },
                { nome: "Cartão de Ponto — Mar/2025", tipo: "PDF", data: "31/03/2025", status: "ok" },
                { nome: "Holerite — Mar/2025", tipo: "PDF", data: "05/04/2025", status: "ok" },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{d.nome}</div>
                    <div className="text-xs text-muted-foreground">{d.tipo} · {d.data}</div>
                  </div>
                  <span className="orizon-badge-emerald text-[10px]">{d.status}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info("Download do documento")}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" onClick={() => toast.info("Upload de documento")}>
                <Plus className="w-4 h-4 mr-2" />Enviar Documento
              </Button>
            </TabsContent>

            <TabsContent value="pdi" className="space-y-3 mt-0">
              <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                <div className="font-bold text-sm text-violet-900 mb-1">PDI — Plano de Desenvolvimento Individual</div>
                <p className="text-xs text-violet-700">Período: Jan–Dez 2025 · Gestor responsável: Carlos Mendes</p>
              </div>
              {[
                { meta: "Certificação em Vendas Consultivas", prazo: "Jun/2025", progresso: 65, categoria: "Técnico" },
                { meta: "Curso de Liderança e Gestão de Equipes", prazo: "Set/2025", progresso: 30, categoria: "Comportamental" },
                { meta: "Inglês Avançado (B2)", prazo: "Dez/2025", progresso: 45, categoria: "Idioma" },
                { meta: "Mentoria com Diretor Comercial", prazo: "Ago/2025", progresso: 80, categoria: "Mentoria" },
              ].map((p, i) => (
                <div key={i} className="p-3 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold">{p.meta}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="orizon-badge-indigo text-[10px]">{p.categoria}</span>
                        <span className="text-xs text-muted-foreground">Prazo: {p.prazo}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{p.progresso}%</span>
                  </div>
                  <Progress value={p.progresso} className="h-1.5" />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="historico" className="space-y-2 mt-0">
              {[
                { data: "08/04/2025", evento: "Avaliação 360° concluída", tipo: "avaliacao", score: "92/100" },
                { data: "01/04/2025", evento: "Férias aprovadas (15 dias)", tipo: "ferias", score: "" },
                { data: "15/03/2025", evento: "Aniversário de 3 anos na empresa", tipo: "aniversario", score: "" },
                { data: "10/02/2025", evento: "Trilha de Vendas Avançadas concluída", tipo: "treinamento", score: "95/100" },
                { data: "05/01/2025", evento: "PDI 2025 criado e aprovado", tipo: "pdi", score: "" },
                { data: "15/12/2024", evento: "Promoção: Analista → Consultor Sênior", tipo: "promocao", score: "" },
              ].map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm",
                    h.tipo === "avaliacao" ? "bg-indigo-100 text-indigo-600" :
                    h.tipo === "ferias" ? "bg-amber-100 text-amber-600" :
                    h.tipo === "treinamento" ? "bg-violet-100 text-violet-600" :
                    h.tipo === "promocao" ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
                  )}>
                    {h.tipo === "avaliacao" ? "📊" : h.tipo === "ferias" ? "🏖" : h.tipo === "treinamento" ? "🎓" : h.tipo === "promocao" ? "🚀" : "📅"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{h.evento}</div>
                    <div className="text-xs text-muted-foreground">{h.data}{h.score && ` · ${h.score}`}</div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default function Colaboradores() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof colaboradores[0] | null>(null);
  const [filterDept, setFilterDept] = useState("todos");

  const depts = ["todos", ...Array.from(new Set(colaboradores.map(c => c.dept)))];

  const filtered = colaboradores.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cargo.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "todos" || c.dept === filterDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="p-6 space-y-6">
      {selected && <ColaboradorDetalhe colab={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Colaboradores</h1>
          <p className="text-muted-foreground text-sm mt-1">Jornada completa do colaborador — ficha, histórico e desenvolvimento</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.info("Formulário de admissão")}>
          <Plus className="w-4 h-4 mr-2" />Admitir Colaborador
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Ativos", value: colaboradores.filter(c => c.status === "ativo").length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Em Férias", value: colaboradores.filter(c => c.status === "ferias").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Afastados", value: colaboradores.filter(c => c.status === "afastado").length, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Score Médio", value: Math.round(colaboradores.reduce((s, c) => s + c.score, 0) / colaboradores.length) + " pts", color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((s) => (
          <Card key={s.label} className="orizon-card">
            <CardContent className={cn("p-4 rounded-xl", s.bg)}>
              <div className={cn("text-2xl font-extrabold tabular-nums", s.color)}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {depts.map((d) => (
            <Button
              key={d}
              variant={filterDept === d ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDept(d)}
              className={filterDept === d ? "orizon-gradient text-white" : ""}
            >
              {d === "todos" ? "Todos" : d}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <Card
            key={c.id}
            className="orizon-card cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
            onClick={() => setSelected(c)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{c.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.cargo}</div>
                  <span className={cn("mt-1 inline-block", statusColors[c.status])}>
                    {statusLabels[c.status]}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" />{c.dept}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />Desde {c.admissao}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{c.cidade}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold">{c.score} pts</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
