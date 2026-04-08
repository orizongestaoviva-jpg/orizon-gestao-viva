/*
 * ORIZON — Gestão Viva
 * Módulo: Ponto Eletrônico
 * Registro web/mobile/QR, banco de horas, escalas, exportação
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Clock, CheckCircle2, AlertTriangle, QrCode, Smartphone,
  Monitor, MapPin, Camera, Download, Filter, Calendar,
  ArrowRight, TrendingUp, Users, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const registrosDia = [
  { id: 1, nome: "Ana Souza", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", entrada: "08:02", almoco_saida: "12:05", almoco_retorno: "13:02", saida: null, status: "trabalhando", horas: "4h58", extra: "0h" },
  { id: 2, nome: "Carlos Mendes", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", entrada: "08:55", almoco_saida: "12:00", almoco_retorno: "13:00", saida: "17:58", status: "saiu", horas: "8h03", extra: "0h03" },
  { id: 3, nome: "Lucas Ferreira", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", entrada: "07:45", almoco_saida: "12:10", almoco_retorno: "13:05", saida: null, status: "trabalhando", horas: "5h20", extra: "0h20" },
  { id: 4, nome: "Beatriz Santos", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", entrada: null, almoco_saida: null, almoco_retorno: null, saida: null, status: "ausente", horas: "0h", extra: "0h" },
  { id: 5, nome: "Rafael Lima", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", entrada: "09:15", almoco_saida: "12:30", almoco_retorno: "13:30", saida: "18:10", status: "saiu", horas: "7h55", extra: "0h" },
];

const bancoHoras = [
  { nome: "Lucas Ferreira", saldo: "+12h30", tipo: "positivo" },
  { nome: "Ana Souza", saldo: "+8h15", tipo: "positivo" },
  { nome: "Carlos Mendes", saldo: "+2h45", tipo: "positivo" },
  { nome: "Beatriz Santos", saldo: "-4h00", tipo: "negativo" },
  { nome: "Rafael Lima", saldo: "+1h20", tipo: "positivo" },
];

export default function Ponto() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pontoRegistrado, setPontoRegistrado] = useState(false);
  const [tab, setTab] = useState("hoje");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegistrarPonto = () => {
    setPontoRegistrado(true);
    toast.success("Ponto registrado com sucesso! 08:02 — Entrada");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Ponto Eletrônico</h1>
          <p className="text-muted-foreground text-sm mt-1">Registro web, mobile e QR Code · Banco de horas · Escalas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Exportar folha de ponto")}>
            <Download className="w-4 h-4 mr-2" />Exportar Folha
          </Button>
        </div>
      </div>

      {/* Relógio + Registro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="orizon-card lg:col-span-1 orizon-gradient text-white">
          <CardContent className="p-6 text-center">
            <div className="text-5xl font-extrabold tabular-nums mb-1">
              {currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="text-white/70 text-sm mb-6">
              {currentTime.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <Button
              className={cn("w-full font-bold text-base h-12", pontoRegistrado ? "bg-emerald-500 hover:bg-emerald-600" : "bg-white text-indigo-700 hover:bg-white/90")}
              onClick={handleRegistrarPonto}
            >
              {pontoRegistrado ? <><CheckCircle2 className="w-5 h-5 mr-2" />Ponto Registrado</> : <><Clock className="w-5 h-5 mr-2" />Registrar Ponto</>}
            </Button>
            <div className="flex justify-center gap-4 mt-4 text-xs text-white/60">
              <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5" />Web</span>
              <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" />Mobile</span>
              <span className="flex items-center gap-1"><QrCode className="w-3.5 h-3.5" />QR Code</span>
              <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" />Facial</span>
            </div>
          </CardContent>
        </Card>

        <Card className="orizon-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Meu Ponto — Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: "Entrada", time: "08:02", status: "ok" },
                { label: "Saída Almoço", time: "12:05", status: "ok" },
                { label: "Retorno", time: "13:02", status: "ok" },
                { label: "Saída", time: "--:--", status: "pendente" },
              ].map((p) => (
                <div key={p.label} className={cn("p-3 rounded-xl text-center border", p.status === "ok" ? "bg-emerald-50 border-emerald-200" : "bg-muted/30 border-dashed border-border")}>
                  <div className={cn("text-lg font-extrabold tabular-nums", p.status === "ok" ? "text-emerald-700" : "text-muted-foreground")}>{p.time}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
              <div>
                <div className="text-sm font-bold text-indigo-900">Horas trabalhadas hoje</div>
                <div className="text-xs text-indigo-600">Jornada: 8h · Saldo: +0h20 banco de horas</div>
              </div>
              <div className="text-2xl font-extrabold text-indigo-700 tabular-nums">4h58</div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>Localização verificada: Av. Paulista, 1000 — São Paulo, SP</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="hoje">Equipe Hoje</TabsTrigger>
          <TabsTrigger value="banco">Banco de Horas</TabsTrigger>
          <TabsTrigger value="ajustes">Ajustes & Aprovações</TabsTrigger>
          <TabsTrigger value="escalas">Escalas</TabsTrigger>
        </TabsList>

        <TabsContent value="hoje" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Registros de Hoje — {currentTime.toLocaleDateString("pt-BR")}</CardTitle>
                <div className="flex gap-2">
                  <span className="orizon-badge-emerald">{registrosDia.filter(r => r.status !== "ausente").length} presentes</span>
                  <span className="orizon-badge-rose">{registrosDia.filter(r => r.status === "ausente").length} ausente</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Colaborador</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Entrada</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Saída Almoço</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Retorno</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Saída</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Horas</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosDia.map((r) => (
                      <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-7 h-7 shrink-0">
                              <AvatarImage src={r.avatar} />
                              <AvatarFallback className="text-[10px]">{r.nome[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{r.nome}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-sm">{r.entrada || "—"}</td>
                        <td className="py-3 px-3 text-center font-mono text-sm">{r.almoco_saida || "—"}</td>
                        <td className="py-3 px-3 text-center font-mono text-sm">{r.almoco_retorno || "—"}</td>
                        <td className="py-3 px-3 text-center font-mono text-sm">{r.saida || "—"}</td>
                        <td className="py-3 px-3 text-center font-bold tabular-nums">{r.horas}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={cn(
                            r.status === "trabalhando" ? "orizon-badge-emerald" :
                            r.status === "saiu" ? "orizon-badge-indigo" : "orizon-badge-rose"
                          )}>
                            {r.status === "trabalhando" ? "● Trabalhando" : r.status === "saiu" ? "✓ Saiu" : "✗ Ausente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banco" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Banco de Horas — Abril 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bancoHoras.map((b, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{b.nome}</div>
                    <div className="text-xs text-muted-foreground">Saldo acumulado</div>
                  </div>
                  <div className={cn("font-bold text-lg tabular-nums", b.tipo === "positivo" ? "text-emerald-600" : "text-rose-500")}>
                    {b.saldo}
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.info("Compensação agendada")}>
                    Compensar
                  </Button>
                </div>
              ))}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 mt-2">
                <div className="text-xs font-bold text-amber-700 mb-1">⚖️ CLT — Banco de Horas</div>
                <p className="text-xs text-amber-600">Banco de horas regulamentado conforme CLT Art. 59. Compensação deve ocorrer em até 6 meses. Horas excedentes geram adicional de 50% (dias úteis) ou 100% (domingos/feriados).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ajustes" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Solicitações de Ajuste</CardTitle>
                <Button size="sm" className="orizon-gradient text-white" onClick={() => toast.info("Nova solicitação")}>
                  <Plus className="w-4 h-4 mr-2" />Solicitar Ajuste
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { colab: "Ana Souza", data: "05/04/2025", motivo: "Sistema fora do ar", original: "08:00", solicitado: "07:55", status: "pendente" },
                  { colab: "Lucas Ferreira", data: "03/04/2025", motivo: "Esqueceu de registrar", original: "—", solicitado: "17:30", status: "aprovado" },
                  { colab: "Beatriz Santos", data: "02/04/2025", motivo: "Reunião externa", original: "08:10", solicitado: "08:00", status: "reprovado" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{a.colab}</div>
                      <div className="text-xs text-muted-foreground">{a.data} · {a.motivo}</div>
                      <div className="text-xs mt-1">
                        <span className="text-muted-foreground">Original: </span>
                        <span className="font-mono">{a.original}</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                        <span className="font-mono font-semibold">{a.solicitado}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        a.status === "aprovado" ? "orizon-badge-emerald" :
                        a.status === "reprovado" ? "orizon-badge-rose" : "orizon-badge-amber"
                      )}>
                        {a.status}
                      </span>
                      {a.status === "pendente" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600" onClick={() => toast.success("Ajuste aprovado")}>Aprovar</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-rose-500" onClick={() => toast.error("Ajuste reprovado")}>Reprovar</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalas" className="mt-4">
          <Card className="orizon-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Escalas e Jornadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nome: "Jornada Padrão 8h", horario: "08:00 – 17:00 (1h almoço)", dias: "Seg–Sex", colaboradores: 120, tipo: "padrao" },
                  { nome: "Jornada Flexível", horario: "06:00 – 20:00 (janela 8h)", dias: "Seg–Sex", colaboradores: 25, tipo: "flexivel" },
                  { nome: "Escala 6×1", horario: "08:00 – 14:00 / 14:00 – 20:00", dias: "Seg–Sáb", colaboradores: 9, tipo: "escala" },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      e.tipo === "padrao" ? "bg-indigo-100" : e.tipo === "flexivel" ? "bg-violet-100" : "bg-amber-100"
                    )}>
                      <Clock className={cn("w-5 h-5", e.tipo === "padrao" ? "text-indigo-600" : e.tipo === "flexivel" ? "text-violet-600" : "text-amber-600")} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{e.nome}</div>
                      <div className="text-xs text-muted-foreground">{e.horario} · {e.dias}</div>
                    </div>
                    <div className="text-center shrink-0">
                      <div className="font-bold text-sm">{e.colaboradores}</div>
                      <div className="text-xs text-muted-foreground">colaboradores</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.info("Editar escala")}>Editar</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
