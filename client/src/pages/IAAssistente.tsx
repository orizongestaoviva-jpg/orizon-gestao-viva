/*
 * ORIZON — Gestão Viva
 * Módulo: IA Assistente
 * Chat inteligente, análises, geração de documentos, insights
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Send, User, Bot, Copy, ThumbsUp, ThumbsDown,
  FileText, BarChart3, Users, Lightbulb, Zap, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const sugestoes = [
  { icone: BarChart3, texto: "Analise o desempenho de vendas do Q1", categoria: "Análise" },
  { icone: Users, texto: "Quais colaboradores têm risco de desligamento?", categoria: "Pessoas" },
  { icone: FileText, texto: "Gere uma política de home office", categoria: "Documentos" },
  { icone: Lightbulb, texto: "Sugira ações para melhorar o clima organizacional", categoria: "Estratégia" },
  { icone: Zap, texto: "Crie um PDI para um consultor de vendas sênior", categoria: "Desenvolvimento" },
  { icone: FileText, texto: "Elabore um comunicado sobre a avaliação de desempenho", categoria: "Comunicação" },
];

const respostasIA: Record<string, string> = {
  default: `Olá! Sou a IA ORIZON, sua assistente de gestão de pessoas. Posso ajudar com:

**📊 Análises e Relatórios**
- Desempenho de vendas e KPIs
- Relatórios de clima organizacional
- Análise de turnover e retenção

**👥 Gestão de Pessoas**
- Identificação de riscos de desligamento
- Sugestões de PDI e desenvolvimento
- Análise de competências

**📄 Geração de Documentos**
- Políticas e comunicados
- Descrições de vagas
- Feedbacks estruturados

Como posso ajudar você hoje?`,
  vendas: `**📊 Análise de Vendas — Q1 2025**

O time de Vendas teve um desempenho excepcional no Q1:

- **Meta atingida:** 112% (R$ 2,8M de R$ 2,5M planejados)
- **Top performer:** Lucas Ferreira (R$ 680k — 136% da meta individual)
- **Novos clientes:** 18 (meta: 15)
- **Ticket médio:** R$ 3.150 (meta: R$ 3.000)

**Insights:**
✅ A estratégia de vendas consultivas está funcionando
⚠️ 3 consultores abaixo de 80% da meta — recomendo coaching individualizado
💡 Oportunidade: expandir o modelo de Lucas Ferreira para o restante da equipe

Deseja que eu gere um relatório detalhado ou um plano de ação para os consultores abaixo da meta?`,
  risco: `**⚠️ Análise de Risco de Desligamento — Abril 2025**

Identifiquei **3 colaboradores em alto risco** com base em múltiplos indicadores:

**🔴 Alto Risco:**
1. **Beatriz Santos** (Marketing) — Queda de engajamento, 2 faltas injustificadas, última avaliação 360° abaixo da média
2. **Thiago Alves** (Operações) — Afastado há 15 dias, histórico de insatisfação no clima
3. **Rafael Lima** (TI) — Recrutadores externos contatando, sem promoção há 2 anos

**Ações Recomendadas:**
- Agendar 1:1 urgente com gestores diretos
- Revisar pacote de benefícios e remuneração
- Criar PDI com perspectiva clara de crescimento
- Considerar mudança de função/projeto para Thiago

Deseja que eu crie um plano de retenção personalizado para cada um?`,
  pdi: `**📋 PDI Sugerido — Consultor de Vendas Sênior**

**Colaborador:** Ana Souza | **Período:** Jan–Dez 2025

**Objetivos de Desenvolvimento:**

| Meta | Categoria | Prazo | Impacto |
|------|-----------|-------|---------|
| Certificação SPIN Selling | Técnico | Jun/25 | Alto |
| Curso de Liderança (preparação para gestão) | Comportamental | Set/25 | Alto |
| Inglês B2 (clientes internacionais) | Idioma | Dez/25 | Médio |
| Mentoria com Diretor Comercial | Mentoria | Ago/25 | Alto |

**Indicadores de Sucesso:**
- Ticket médio acima de R$ 3.500
- NPS de clientes ≥ 9
- Preparação para promoção a Coordenadora de Vendas em 2026

Deseja que eu ajuste algum item ou gere o documento formal do PDI?`,
};

function getIAResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("vend") || lower.includes("q1") || lower.includes("meta") || lower.includes("desempenho")) return respostasIA.vendas;
  if (lower.includes("risco") || lower.includes("desligamento") || lower.includes("turnover")) return respostasIA.risco;
  if (lower.includes("pdi") || lower.includes("desenvolvimento") || lower.includes("plano")) return respostasIA.pdi;
  return respostasIA.default;
}

export default function IAAssistente() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: respostasIA.default,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getIAResponse(userMsg.content),
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSugestao = (texto: string) => {
    setInput(texto);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4" style={{ height: "calc(100vh - 80px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            IA ORIZON
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Assistente inteligente de gestão de pessoas e performance</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setMessages([{ id: 1, role: "assistant", content: respostasIA.default, timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }]); toast.info("Conversa reiniciada"); }}>
          <RefreshCw className="w-4 h-4 mr-2" />Nova Conversa
        </Button>
      </div>

      {/* Sugestões */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 shrink-0">
          {sugestoes.map((s, i) => {
            const Icon = s.icone;
            return (
              <button
                key={i}
                className="flex items-start gap-2 p-3 rounded-xl border border-border hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left"
                onClick={() => handleSugestao(s.texto)}
              >
                <Icon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">{s.categoria}</div>
                  <div className="text-xs font-medium mt-0.5">{s.texto}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "assistant" ? "orizon-gradient" : "bg-muted"
            )}>
              {msg.role === "assistant" ? (
                <Sparkles className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className={cn("max-w-[80%] space-y-1", msg.role === "user" ? "items-end" : "items-start")}>
              <div className={cn("rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "assistant" ? "bg-card border border-border" : "orizon-gradient text-white"
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              <div className={cn("flex items-center gap-2 px-1", msg.role === "user" ? "justify-end" : "justify-start")}>
                <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                {msg.role === "assistant" && (
                  <>
                    <button className="text-muted-foreground hover:text-foreground" onClick={() => { navigator.clipboard.writeText(msg.content); toast.success("Copiado!"); }}>
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="text-muted-foreground hover:text-emerald-600" onClick={() => toast.success("Obrigado pelo feedback!")}>
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="text-muted-foreground hover:text-rose-500" onClick={() => toast.info("Feedback enviado")}>
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full orizon-gradient flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex gap-2">
        <Input
          placeholder="Pergunte sobre colaboradores, métricas, documentos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          className="flex-1"
        />
        <Button
          className="orizon-gradient text-white shrink-0"
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
