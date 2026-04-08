/*
 * ORIZON — Gestão Viva
 * Módulo: Admin Master
 * Gestão de empresas, usuários, planos, integrações, LGPD
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Building2, Users, CreditCard, Shield, Settings, Plus,
  Search, CheckCircle2, AlertTriangle, TrendingUp, Globe,
  Key, Database, Bell, Lock, Eye, Edit, Trash2, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const empresas = [
  { id: 1, nome: "TechCorp Brasil", cnpj: "12.345.678/0001-90", plano: "Enterprise", colaboradores: 154, status: "ativo", mrr: "R$ 4.900" },
  { id: 2, nome: "Varejo Plus", cnpj: "98.765.432/0001-10", plano: "Pro", colaboradores: 45, status: "ativo", mrr: "R$ 1.350" },
  { id: 3, nome: "Construtora ABC", cnpj: "11.222.333/0001-44", plano: "Starter", colaboradores: 22, status: "trial", mrr: "R$ 0" },
  { id: 4, nome: "Saúde & Vida", cnpj: "55.666.777/0001-88", plano: "Pro", colaboradores: 78, status: "ativo", mrr: "R$ 2.340" },
  { id: 5, nome: "Logística Express", cnpj: "33.444.555/0001-22", plano: "Enterprise", colaboradores: 210, status: "ativo", mrr: "R$ 6.300" },
];

const planos = [
  { nome: "Starter", preco: "R$ 49/mês", colaboradores: "Até 25", modulos: "8 módulos", empresas: 12, cor: "bg-emerald-100 text-emerald-700" },
  { nome: "Pro", preco: "R$ 30/colaborador", colaboradores: "26–100", modulos: "16 módulos", empresas: 28, cor: "bg-indigo-100 text-indigo-700" },
  { nome: "Enterprise", preco: "Personalizado", colaboradores: "100+", modulos: "Todos + IA", empresas: 8, cor: "bg-violet-100 text-violet-700" },
];

const integracoes = [
  { nome: "Google Workspace", status: "conectado", tipo: "Produtividade" },
  { nome: "Microsoft 365", status: "conectado", tipo: "Produtividade" },
  { nome: "Slack", status: "conectado", tipo: "Comunicação" },
  { nome: "Zenklub", status: "conectado", tipo: "Saúde Mental" },
  { nome: "Gympass", status: "conectado", tipo: "Bem-estar" },
  { nome: "Gupy", status: "disponivel", tipo: "R&S" },
  { nome: "Totvs", status: "disponivel", tipo: "ERP" },
  { nome: "SAP", status: "disponivel", tipo: "ERP" },
];

export default function AdminMaster() {
  const [tab, setTab] = useState("empresas");
  const [search, setSearch] = useState("");

  const filteredEmpresas = empresas.filter(e =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold">Admin Master</h1>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">SUPER ADMIN</span>
          </div>
          <p className="text-muted-foreground text-sm">Gestão global de empresas, usuários, planos e integrações</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.info("Nova empresa cadastrada")}>
          <Plus className="w-4 h-4 mr-2" />Nova Empresa
        </Button>
      </div>

      {/* Stats globais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Empresas Ativas", value: empresas.filter(e => e.status === "ativo").length, icon: Building2, color: "bg-indigo-600" },
          { label: "Total Colaboradores", value: empresas.reduce((s, e) => s + e.colaboradores, 0), icon: Users, color: "bg-violet-600" },
          { label: "MRR Total", value: "R$ 14.890", icon: CreditCard, color: "bg-emerald-600" },
          { label: "Em Trial", value: empresas.filter(e => e.status === "trial").length, icon: AlertTriangle, color: "bg-amber-500" },
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
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
          <TabsTrigger value="lgpd">LGPD & Segurança</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="empresas" className="mt-4">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar empresa..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
          <Card className="orizon-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Empresa</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">CNPJ</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground">Plano</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground">Colaboradores</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground">MRR</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmpresas.map((e) => (
                      <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-semibold">{e.nome}</td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{e.cnpj}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                            e.plano === "Enterprise" ? "bg-violet-100 text-violet-700" :
                            e.plano === "Pro" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                          )}>{e.plano}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{e.colaboradores}</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-700">{e.mrr}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(e.status === "ativo" ? "orizon-badge-emerald" : "orizon-badge-amber")}>
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info(`Acessando ${e.nome}`)}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("Editando empresa")}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planos" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {planos.map((p) => (
              <Card key={p.nome} className="orizon-card">
                <CardContent className="p-6">
                  <span className={cn("text-sm font-bold px-3 py-1 rounded-full inline-block mb-4", p.cor)}>{p.nome}</span>
                  <div className="text-2xl font-extrabold mb-1">{p.preco}</div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div>👥 {p.colaboradores} colaboradores</div>
                    <div>🧩 {p.modulos}</div>
                    <div>🏢 {p.empresas} empresas ativas</div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Editar plano")}>
                    <Edit className="w-4 h-4 mr-2" />Editar Plano
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integracoes" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {integracoes.map((int, i) => (
              <Card key={i} className="orizon-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{int.nome}</div>
                    <div className="text-xs text-muted-foreground">{int.tipo}</div>
                  </div>
                  {int.status === "conectado" ? (
                    <span className="orizon-badge-emerald">Conectado</span>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info(`Conectando ${int.nome}`)}>
                      Conectar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lgpd" className="mt-4 space-y-4">
          <Card className="orizon-card border-indigo-200 bg-indigo-50/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-base text-indigo-900">Conformidade LGPD — Lei 13.709/2018</div>
                  <p className="text-sm text-indigo-700 mt-1">
                    O ORIZON opera em conformidade total com a LGPD. Todos os dados pessoais são criptografados em trânsito (TLS 1.3) e em repouso (AES-256). 
                    O sistema mantém logs de auditoria, controle de acesso por nível e permite exclusão de dados mediante solicitação do titular.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["Criptografia AES-256", "TLS 1.3", "Logs de Auditoria", "DPO Designado", "RIPD Atualizado"].map(tag => (
                      <span key={tag} className="orizon-badge-emerald text-[10px]">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { titulo: "Solicitações de Titulares", desc: "0 solicitações pendentes", icon: Users, status: "ok" },
              { titulo: "Relatório de Impacto (RIPD)", desc: "Atualizado em 01/04/2025", icon: FileText, status: "ok" },
              { titulo: "Mapeamento de Dados", desc: "154 tipos de dados mapeados", icon: Database, status: "ok" },
              { titulo: "Incidentes de Segurança", desc: "0 incidentes nos últimos 90 dias", icon: Shield, status: "ok" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Card key={i} className="orizon-card">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{item.titulo}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="configuracoes" className="mt-4 space-y-4">
          {[
            { titulo: "Notificações do Sistema", desc: "Alertas automáticos por e-mail e push", icon: Bell },
            { titulo: "Autenticação 2FA", desc: "Obrigatório para admins e gestores", icon: Key },
            { titulo: "Logs de Auditoria", desc: "Retenção de 2 anos conforme LGPD", icon: Database },
            { titulo: "Backup Automático", desc: "Diário às 03:00 — Retenção 30 dias", icon: Shield },
          ].map((cfg, i) => {
            const Icon = cfg.icon;
            return (
              <Card key={i} className="orizon-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{cfg.titulo}</div>
                    <div className="text-xs text-muted-foreground">{cfg.desc}</div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.info("Configuração salva")}>
                    Configurar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
