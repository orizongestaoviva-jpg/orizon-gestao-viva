/**
 * ORIZON — Gestão Viva
 * Dashboard Admin Master: Painel exclusivo para proprietário
 * Gestão de clientes, permissões, liberações e configurações gerais
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Building2, Users, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownRight, Shield, Settings, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const clientesData = [
  { mes: "Jan", clientes: 12, receita: 450000, churn: 0 },
  { mes: "Fev", clientes: 14, receita: 520000, churn: 1 },
  { mes: "Mar", clientes: 16, receita: 610000, churn: 0 },
  { mes: "Abr", clientes: 18, receita: 720000, churn: 1 },
];

const clientes = [
  { id: 1, name: "TechBrasil Ltda.", plan: "Enterprise", users: 154, status: "ativo", mrr: "R$ 12.500", joined: "Jan 2024" },
  { id: 2, name: "Varejo Plus", plan: "Pro", users: 45, status: "ativo", mrr: "R$ 4.200", joined: "Mar 2024" },
  { id: 3, name: "Construtora ABC", plan: "Starter", users: 22, status: "trial", mrr: "R$ 1.500", joined: "Abr 2026" },
  { id: 4, name: "Saúde & Vida", plan: "Pro", users: 78, status: "ativo", mrr: "R$ 6.800", joined: "Fev 2024" },
  { id: 5, name: "Logística Express", plan: "Enterprise", users: 210, status: "ativo", mrr: "R$ 18.900", joined: "Dez 2023" },
];

const permissoes = [
  { id: 1, user: "Carlos Mendes", role: "Admin Empresa", company: "TechBrasil", status: "ativo", lastLogin: "há 2h" },
  { id: 2, user: "Ana Silva", role: "Gestor RH", company: "Varejo Plus", status: "ativo", lastLogin: "há 1 dia" },
  { id: 3, user: "Roberto Admin", role: "Admin Master", company: "ORIZON", status: "ativo", lastLogin: "agora" },
];

const alertas = [
  { id: 1, type: "warning", title: "TechBrasil: Limite de usuários atingido", message: "Empresa está usando 154/150 usuários", action: "Aumentar limite" },
  { id: 2, type: "error", title: "Pagamento pendente: Construtora ABC", message: "Fatura de Abril vencida há 3 dias", action: "Cobrar" },
  { id: 3, type: "info", title: "Novo plano disponível", message: "Lançar plano 'Unlimited' para grandes empresas", action: "Configurar" },
];

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
}

function KpiCard({ title, value, change, positive, icon: Icon, color }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardAdmin() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Admin Master</h1>
          <p className="text-sm text-muted-foreground">
            Painel de controle — Gestão de clientes, permissões e configurações
          </p>
        </div>
        <Button>Gerar Relatório</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Clientes Ativos"
          value="18"
          change="+50%"
          positive={true}
          icon={Building2}
          color="bg-indigo-500"
        />
        <KpiCard
          title="Usuários Totais"
          value="509"
          change="+12,3%"
          positive={true}
          icon={Users}
          color="bg-emerald-500"
        />
        <KpiCard
          title="MRR Total"
          value="R$ 43.7k"
          change="+18,5%"
          positive={true}
          icon={DollarSign}
          color="bg-amber-500"
        />
        <KpiCard
          title="Taxa de Retenção"
          value="94,4%"
          change="-0,8%"
          positive={false}
          icon={TrendingUp}
          color="bg-rose-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento de Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Crescimento de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={clientesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="clientes" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Receita Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita Mensal (MRR)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={clientesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="receita" stroke="#059669" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Gestão */}
      <Tabs defaultValue="clientes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        {/* Clientes */}
        <TabsContent value="clientes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Gerenciar Clientes</h3>
            <Button size="sm">+ Novo Cliente</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left font-semibold">Empresa</th>
                      <th className="px-6 py-3 text-left font-semibold">Plano</th>
                      <th className="px-6 py-3 text-left font-semibold">Usuários</th>
                      <th className="px-6 py-3 text-left font-semibold">MRR</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{cliente.name}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{cliente.plan}</Badge>
                        </td>
                        <td className="px-6 py-4">{cliente.users}</td>
                        <td className="px-6 py-4 font-semibold">{cliente.mrr}</td>
                        <td className="px-6 py-4">
                          <Badge className={cliente.status === "ativo" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                            {cliente.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">Editar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissões */}
        <TabsContent value="permissoes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Gerenciar Permissões</h3>
            <Button size="sm">+ Novo Acesso</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left font-semibold">Usuário</th>
                      <th className="px-6 py-3 text-left font-semibold">Função</th>
                      <th className="px-6 py-3 text-left font-semibold">Empresa</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Último Acesso</th>
                      <th className="px-6 py-3 text-left font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissoes.map((perm) => (
                      <tr key={perm.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{perm.user}</td>
                        <td className="px-6 py-4">{perm.role}</td>
                        <td className="px-6 py-4">{perm.company}</td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-100 text-emerald-700">{perm.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{perm.lastLogin}</td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">Editar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alertas */}
        <TabsContent value="alertas" className="space-y-4">
          <h3 className="font-semibold text-foreground">Alertas & Ações Necessárias</h3>

          <div className="space-y-3">
            {alertas.map((alerta) => (
              <Card key={alerta.id} className={cn(
                alerta.type === "warning" ? "border-l-4 border-l-amber-500" :
                alerta.type === "error" ? "border-l-4 border-l-rose-500" :
                "border-l-4 border-l-blue-500"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{alerta.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alerta.message}</p>
                    </div>
                    <Button size="sm" variant="outline">{alerta.action}</Button>
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
